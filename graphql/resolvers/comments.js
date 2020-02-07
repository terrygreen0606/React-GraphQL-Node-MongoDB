const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/PostModel');
const checkAuth = require('../../utilizers/checkAuth');

module.exports = {
	Mutation: {
		async createComment(_, args, context) {
			const { username } = checkAuth(context);

			if (args.body.trim() === '') {
				throw new UserInputError('Empty Comment', {
					errors: { body: 'Comment Body is not provided' }
				});
			}

			const post = await Post.findById(args.postId);
			if (post) {
				post.comments.unshift({
					body: args.body,
					username,
					createdAt: new Date().toISOString()
				});
				return await post.save();
			} else {
				throw new UserInputError('Post is not found');
			}
		},

		async deleteComment(_, args, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(args.postId);
			if (post) {
				const commentIndex = post.comments.findIndex(
					c => c.id === args.commentId
				);

				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				} else {
					throw new AuthenticationError(
						'Action now allowed. You are not the author of this comment'
					);
				}
			} else {
				throw new UserInputError('Post not found');
			}
		}
	}
};
