import gql from 'graphql-tag';

export const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
			roleType
		}
	}
`;

export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export const LOAD_USER = gql`
	query getUser($userId: ID!) {
		getUser(userId: $userId) {
			email
			username
			roleType
		}
	}
`;

export const LOAD_USERS = gql`
	{
		getUsers {
			id
			username
			email
			createdAt
			roleType
			posts {
				id
			}
			comments {
				id
			}
		}
	}
`;

export const DELETE_USER = gql`
	mutation deleteUser($userId: ID!) {
		deleteUser(userId: $userId)
	}
`;

export const ADD_ROLE = gql`
	mutation addRole($userId: ID!, $roleType: Int!) {
		addRole(userId: $userId, roleType: $roleType)
	}
`;
