const { gql } = require('apollo-server');

// Query Type: String! -> ! means required
module.exports = gql`
	type Post {
		id: ID!
		body: String!
		user: User
		userId: String!
		createdAt: String!
		comments: [Comment]
		likes: [Like]
		likesCount: Int
		commentsCount: Int
	}
	type Comment {
		id: ID!
		userId: ID!
		createdAt: String!
		username: String!
		body: String!
	}
	type Like {
		id: ID!
		createdAt: String!
		username: String!
	}
	type User {
		id: ID!
		username: String!
		email: String!
		token: String!
		roleType: Int!
		createdAt: String!
		posts: [Post]
		comments: [Comment]
	}
	type UserInfo {
		users: [User]!
		total: Int!
	}

	input RegisterInput {
		username: String!
		email: String!
		password: String!
		confirmPassword: String!
	}

	type Query {
		getUserInfo(itemsPerPage: Int!, activePage: Int!): UserInfo!
		getUsers: [User]
		getUser(userId: ID!): User
		getPosts: [Post]
		getPost(postId: ID!): Post
	}
	type Mutation {
		# Register and login User
		# RegisterInput and User are custom types above
		register(registerInput: RegisterInput): User!
		login(email: String!, password: String!): User!
		addRole(userId: ID!, roleType: Int!): String!
		deleteUser(userId: ID!): String!
		deleteUsers(userIds: [String]!): String!

		# Create, Delete Post
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!

		# Comments and likes
		createComment(postId: ID!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
	}

	type Subscription {
		newPost: Post!
	}
`;
