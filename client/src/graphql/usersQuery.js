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

export const FORGOT_PASSWORD = gql`
	mutation forgotPassword($email: String!) {
		forgotPassword(email: $email)
	}
`;

export const RESET_PASSWORD = gql`
	query resetPassword($token: String!) {
		resetPassword(token: $token)
	}
`;

export const UPDATE_PASSWORD = gql`
	mutation updatePassword($email: String!, $password: String!) {
		updatePassword(email: $email, password: $password)
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

export const LOAD_PAGINATED_USERS = gql`
	query getUserInfo($itemsPerPage: Int!, $activePage: Int!) {
		getUserInfo(itemsPerPage: $itemsPerPage, activePage: $activePage) {
			total
			users {
				id
				username
				email
				createdAt
				posts {
					id
				}
				comments {
					id
				}
				roleType
			}
		}
	}
`;

export const DELETE_USERS = gql`
	mutation deleteUsers($userIds: [ID!]!) {
		deleteUsers(userIds: $userIds)
	}
`;

export const ADD_ROLE = gql`
	mutation addRole($userId: ID!, $roleType: Int!) {
		addRole(userId: $userId, roleType: $roleType)
	}
`;

export const EDIT_USER = gql`
	mutation editUser(
		$id: ID!
		$email: String!
		$username: String!
		$password: String!
		$roleType: Int!
	) {
		editUser(
			editUserInput: {
				id: $id
				username: $username
				email: $email
				password: $password
				roleType: $roleType
			}
		)
	}
`;

export const ADD_USER = gql`
	mutation addUser(
		$username: String!
		$email: String!
		$password: String!
		$roleType: Int!
	) {
		addUser(
			addUserInput: {
				username: $username
				email: $email
				password: $password
				roleType: $roleType
			}
		) {
			id
			email
			username
			createdAt
			roleType
		}
	}
`;
