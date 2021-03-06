const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/PostModel');
const User = require('../../models/UserModel');
const checkAuth = require('../../utilizers/checkAuth');

module.exports = {
	Post: {
		likesCount: parent => parent.likes.length,
		commentsCount: parent => parent.comments.length,
		user: async parent => {
			try {
				const user = await User.findById(parent.userId);
				return user;
			} catch (err) {
				throw new Error(err);
			}
		}
	},
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},

		async getPost(_, args) {
			try {
				const post = await Post.findById(args.postId);

				if (post) {
					return post;
				} else {
					throw new Error('Post not found');
				}
			} catch (err) {
				throw new Error(err);
			}
		}
	},

	Mutation: {
		async createPost(_, args, context) {
			const user = checkAuth(context);

			if (args.body.trim() === '') {
				throw new UserInputError('Post body is not provided');
			}

			const newPost = new Post({
				body: args.body,
				userId: user.id,
				createdAt: new Date().toISOString()
			});

			const post = await newPost.save();

			context.pubsub.publish('NEW_POST', {
				newPost: post
			});
			return post;
		},

		async deletePost(_, args, context) {
			const user = checkAuth(context);

			// Check if this user has posted this post
			try {
				const post = await Post.findById(args.postId);

				if (user.id === post.userId.toString()) {
					await post.delete();
					return 'Post deleted successfully';
				} else {
					throw new AuthenticationError(
						'Action not allowed. You are not the author of this post'
					);
				}
			} catch (err) {
				throw new Error(err);
			}
		},

		async likePost(_, args, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(args.postId);
			if (post) {
				if (post.likes.find(like => like.username === username)) {
					// Post already liked
					post.likes = post.likes.filter(
						like => like.username !== username
					);
				} else {
					// Post like
					post.likes.push({
						username,
						createdAt: new Date().toISOString()
					});
				}

				await post.save();
				return post;
			} else {
				throw new UserInputError('Post not found');
			}
		}
	},

	Subscription: {
		newPost: {
			subscribe: (_, __, context) =>
				context.pubsub.asyncIterator('NEW_POST')
		}
	}
};
