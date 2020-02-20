const { model, Schema } = require('mongoose');

// Create Schema
const UserSchema = new Schema({
	username: String,
	email: String,
	password: String,
	roleType: {
		type: Number,
		default: 9
	},
	resetPasswordToken: {
		type: String,
		default: null
	},
	resetPasswordExpires: {
		type: String,
		default: null
	},
	createdAt: String
});

module.exports = model('User', UserSchema);
