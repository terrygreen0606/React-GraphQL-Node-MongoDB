const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const Post = require('../../models/PostModel');

module.exports = {
	// This is modifier and graphql firstly goes through this modifier and add things
	Post: {
		...postsResolvers.Post
	},
	User: {
		...usersResolvers.User
	},
	Query: {
		...usersResolvers.Query,
		...postsResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation
	},
	Subscription: {
		...postsResolvers.Subscription
	}
};
