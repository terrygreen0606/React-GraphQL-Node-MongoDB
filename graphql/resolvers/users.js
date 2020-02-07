const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { UserInputError } = require('apollo-server');

const User = require('../../models/UserModel');
const {
	validateRegisterInput,
	validateLoginInput
} = require('../../utilizers/validators');

const generateToken = user => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username
		},
		config.get('jwtSecret'),
		{ expiresIn: '1h' }
	);
};

module.exports = {
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
		}
	}
};
