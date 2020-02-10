const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
	// This is modifier and graphql firstly goes through this modifier and add things
	Post: {
		likesCount: parent => parent.likes.length,
		commentsCount: parent => parent.comments.length
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
