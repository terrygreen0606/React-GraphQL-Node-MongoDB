const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
const { UserInputError, AuthenticationError } = require('apollo-server');

const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const checkAuth = require('../../utilizers/checkAuth');
const sendEmail = require('../../utilizers/sendEmail');
const {
	validateRegisterInput,
	validateLoginInput,
	validateAddUserInput,
	validateForgotPassword
} = require('../../utilizers/validators');

const generateToken = user => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
			roleType: user.roleType
		},
		config.get('jwtSecret'),
		{ expiresIn: '1h' }
	);
};

const checkToken = async token => {
	const user = await User.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() }
	});

	return user;
};

module.exports = {
	User: {
		posts: async parent => {
			try {
				const posts = await Post.find({ userId: parent.id });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		comments: async parent => {
			try {
				let comments = [];
				const posts = await Post.find();

				if (posts.length > 0) {
					posts.map(post => {
						if (post.comments.length > 0) {
							comments = post.comments.filter(
								comment =>
									comment.userId.toString() === parent.id
							);
						}
					});
				}

				return comments;
			} catch (err) {
				throw new Error(err);
			}
		}
	},
	Query: {
		async getUsers(_, __, context) {
			checkAuth(context);
			try {
				const users = await User.find().sort({ createdAt: -1 });
				return users;
			} catch (err) {
				throw new Error(err);
			}
		},

		async getUser(_, args, context) {
			// Check if the user is logged in with jwt
			checkAuth(context);
			try {
				const user = await User.findById(args.userId);

				if (user) {
					return user;
				} else {
					throw new Error('User not found');
				}
			} catch (err) {
				throw new Error(err);
			}
		},

		async getUserInfo(_, args, context) {
			checkAuth(context);
			const { itemsPerPage, activePage } = args;
			try {
				const users = await User.find()
					.skip(itemsPerPage * activePage - itemsPerPage)
					.limit(itemsPerPage)
					.sort({ createdAt: -1 });
				const total = await User.countDocuments();
				return { users, total };
			} catch (err) {
				throw new Error(err);
			}
		},

		async resetPassword(_, args) {
			const user = await checkToken(args.token);
			if (user) {
				return true;
			} else {
				return false;
			}
		}
	},
	Mutation: {
		async login(_, args) {
			const { errors, valid } = validateLoginInput(args);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email: args.email });

			if (!user) {
				errors.notFound = 'User not found';
				throw new UserInputError('The user does not exist', { errors });
			}

			const isMatch = await bcrypt.compare(args.password, user.password);
			if (!isMatch) {
				errors.wrongCred = 'Wrong Credentials';
				throw new UserInputError('Wrong Credentials', { errors });
			}

			const token = generateToken(user);
			return { ...user._doc, id: user.id, token };
		},

		async register(_, args) {
			let {
				username,
				email,
				password,
				confirmPassword
			} = args.registerInput;

			// Validate user input
			const { errors, valid } = validateRegisterInput(args.registerInput);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			// Check if the user already exists
			const isEmail = await User.findOne({ email });
			if (isEmail) {
				throw new UserInputError('Email is already taken', {
					errors: { email: 'This email is already taken' }
				});
			}

			const isUsername = await User.findOne({ username });
			if (isUsername) {
				throw new UserInputError('Username is already taken', {
					errors: { username: 'This username is already taken' }
				});
			}

			// Hash Password and Create an auth token
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString()
			});
			const user = await newUser.save();

			const token = generateToken(user);
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 360000;
			await user.save();

			await sendEmail(user, token, 'email');
			return { ...user._doc, id: user.id, token };
		},

		// Resend email verification link
		async resendLink(_, __, context) {
			const authUser = checkAuth(context);
			const user = await User.findOne({ email: authUser.email });
			const token = generateToken(user);
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 360000;
			await user.save();

			return await sendEmail(user, token, 'email');
		},

		async verifyEmail(_, args) {
			const user = await checkToken(args.token);
			if (user) {
				user.resetPassword = null;
				user.resetPasswordExpires = null;
				user.verified = true;
				await user.save();
				return true;
			} else {
				return false;
			}
		},

		async forgotPassword(_, args) {
			const { errors, valid } = validateForgotPassword(args);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email: args.email });
			if (!user) {
				throw new UserInputError('Errors', {
					errors: { email: 'That email does not exist.' }
				});
			} else {
				const token = crypto.randomBytes(20).toString('hex');

				await User.updateOne(
					{ email: args.email },
					{
						$set: {
							resetPasswordToken: token,
							resetPasswordExpires: Date.now() + 360000
						}
					}
				);

				return await sendEmail(user, token, 'password');
			}
		},

		async updatePassword(_, args) {
			let { email, password } = args;
			const { errors, valid } = validateLoginInput(args);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email });
			if (user) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(password, salt);
				user.resetPasswordToken = null;
				user.resetPasswordExpires = null;
				await user.save();
				return 'The password is updated';
			} else {
				return 'That email is not the registered one in our system.';
			}
		},

		async deleteUsers(_, args, context) {
			const user = checkAuth(context);
			if (Array.isArray(args.userIds) && args.userIds.length) {
				if (user.roleType !== 1) {
					throw new AuthenticationError(
						'Not allowed. You are not the administrator.'
					);
				} else {
					// Way to handle async/await in a loop one by one
					const promises = args.userIds.map(async id => {
						await User.deleteOne({ _id: id });
					});
					await Promise.all(promises);
					return 'The users are successfully deleted';
				}
			} else {
				throw new UserInputError('Please select the users to delete');
			}
		},

		async addRole(_, args, context) {
			const user = checkAuth(context);
			try {
				if (user.roleType !== 1) {
					throw new AuthenticationError(
						'Not allowed. You are not the administrator.'
					);
				} else {
					await User.updateOne(
						{ _id: args.userId },
						{ $set: { roleType: args.roleType } }
					);
					return 'Role has been updated';
				}
			} catch (err) {
				throw new Error(err);
			}
		},

		async addUser(_, args, context) {
			checkAuth(context);
			let { username, email, password, roleType } = args.addUserInput;

			// Validate user input
			const { errors, valid } = validateAddUserInput(args.addUserInput);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			// Check if the user already exists
			const isEmail = await User.findOne({ email });
			if (isEmail) {
				throw new UserInputError('Email is already taken', {
					errors: { email: 'This email is already taken' }
				});
			}

			const isUsername = await User.findOne({ username });
			if (isUsername) {
				throw new UserInputError('Username is already taken', {
					errors: { username: 'This username is already taken' }
				});
			}

			// Hash Password and Create an auth token
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);

			const newUser = new User({
				email,
				username,
				password,
				roleType,
				createdAt: new Date().toISOString()
			});
			const user = await newUser.save();

			return { ...user._doc, id: user.id };
		},

		async editUser(_, args, context) {
			checkAuth(context);
			let {
				username,
				email,
				password,
				roleType,
				id
			} = args.editUserInput;

			// Validate user input
			const { errors, valid } = validateAddUserInput(args.editUserInput);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			// Check if the user already exists
			const isEmail = await User.findOne({ email });
			if (isEmail) {
				throw new UserInputError('Email is already taken', {
					errors: { email: 'This email is already taken' }
				});
			}

			const isUsername = await User.findOne({ username });
			if (isUsername) {
				throw new UserInputError('Username is already taken', {
					errors: { username: 'This username is already taken' }
				});
			}

			// Hash Password and Create an auth token
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);

			await User.updateOne(
				{ _id: id },
				{ $set: { username, email, password, roleType } }
			);

			return 'The user has been updated';
		}
	}
};
