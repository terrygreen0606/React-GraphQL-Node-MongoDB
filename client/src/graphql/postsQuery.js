import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			user {
				id
				username
				email
			}
			createdAt
			likesCount
			likes {
				username
			}
			commentsCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export const FETCH_POST_QUERY = gql`
	query getPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			user {
				id
				username
				email
			}
			createdAt
			likesCount
			likes {
				username
			}
			commentsCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export const ADD_POST = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			user {
				id
				username
				email
			}
			likes {
				id
				username
				createdAt
			}
			likesCount
			comments {
				id
				body
				username
				createdAt
			}
			commentsCount
		}
	}
`;

export const DELETE_POST = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

export const LIKE_P0ST = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likesCount
		}
	}
`;

export const ADD_COMMENT = gql`
	mutation createComment($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			body
			createdAt
			likesCount
			comments {
				id
				body
				username
				createdAt
			}
			commentsCount
		}
	}
`;

export const DELETE_COMMENT = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentsCount
		}
	}
`;
