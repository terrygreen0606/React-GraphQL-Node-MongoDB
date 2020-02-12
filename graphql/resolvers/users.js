const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { UserInputError, AuthenticationError } = require('apollo-server');

const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const checkAuth = require('../../utilizers/checkAuth');
const {
	validateRegisterInput,
	validateLoginInput
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
			return { ...user._doc, id: user.id, token };
		},

		async deleteUser(_, args, context) {
			const user = checkAuth(context);
			try {
				if (user.roleType !== 1) {
					throw new AuthenticationError(
						'Not allowed. You are not the administrator.'
					);
				} else {
					const userTobeDeleted = await User.findById(args.userId);
					await userTobeDeleted.delete();
					return 'The user is successfully deleted';
				}
			} catch (err) {
				throw new Error(err);
			}
		},

		async addAdminRole(_, args, context) {
			const user = checkAuth(context);
			try {
				if (user.roleType !== 1) {
					throw new AuthenticationError(
						'Not allowed. You are not the administrator.'
					);
				} else {
					await User.updateOne(
						{ _id: args.userId },
						{ $set: { roleType: 1 } }
					);
					return 'The user has become an administrator';
				}
			} catch (err) {
				throw new Error(err);
			}
		}
	}
};
