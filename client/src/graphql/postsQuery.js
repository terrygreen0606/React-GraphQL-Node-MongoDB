import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			username
			userEmail
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
			username
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
