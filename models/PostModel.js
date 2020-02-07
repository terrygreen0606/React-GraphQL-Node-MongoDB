const { model, Schema } = require('mongoose');

// Create Schema
const PostSchema = new Schema({
	body: String,
	username: String,
	userEmail: String,
	createdAt: String,
	comments: [{ body: String, username: String, createdAt: String }],
	likes: [{ username: String, createdAt: String }],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
});

module.exports = model('Post', PostSchema);
