import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { LOAD_USER } from '../../graphql/usersQuery';
import { UserContext } from '../../context/UserContext';

const WithUserStatus = OriginalComponent => {
	const WrappedComponent = props => {
		// HOC to get the user status
		// userStatus ? 0->not logged in, 9->logged in, but not an admin, 1->admin, <0 -> loading
		const authUser = useContext(UserContext).user;
		const { loading, error, data } = useQuery(LOAD_USER, {
			variables: { userId: authUser.id }
		});
		let userStatus = 0;

		if (authUser) {
			if (error) {
				console.log(error.graphQLErrors[0].message);
			} else if (loading) {
				userStatus = -1;
			} else {
				userStatus = data.getUser.roleType;
			}
		}

		return <OriginalComponent userStatus={userStatus} {...props} />;
	};

	return WrappedComponent;
};

export default WithUserStatus;
