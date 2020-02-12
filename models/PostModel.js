const { model, Schema } = require('mongoose');

// Create Schema
const PostSchema = new Schema({
	body: String,
	createdAt: String,
	comments: [
		{
			body: String,
			username: String,
			createdAt: String,
			userId: Schema.Types.ObjectId
		}
	],
	likes: [{ username: String, createdAt: String }],
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
});

module.exports = model('Post', PostSchema);
