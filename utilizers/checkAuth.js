const jwt = require('jsonwebtoken');
const config = require('config');
const { AuthenticationError } = require('apollo-server');

module.exports = context => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		// Bearer ...
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				const user = jwt.verify(token, config.get('jwtSecret'));
				return user;
			} catch (err) {
				throw new AuthenticationError('Invalid/Expired Token');
			}
		}

		throw new Error(
			"Authentication token must be in type of 'Bearer [token]'"
		);
	}

	throw new Error('Authorization Header is not provided');
};
