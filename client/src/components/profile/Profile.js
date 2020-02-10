import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { LOAD_USER } from '../../graphql/usersQuery';
import { UserContext } from '../../context/UserContext';

const Profile = () => {
	const { user } = useContext(UserContext);
	const { loading, error, data } = useQuery(LOAD_USER, {
		variables: { userId: user.id }
	});

	if (error) {
		console.log(error.graphQLErrors[0].message);
	}

	if (!loading) {
		const user = data.getUser;
		return (
			<div className="user">
				<p>{user.username}</p>
				<p>{user.email}</p>
			</div>
		);
	} else {
		return <div>Loading...</div>;
	}
};

export default Profile;
