import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			username
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
