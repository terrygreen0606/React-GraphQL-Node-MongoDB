import React from 'react';
import WithUserStatus from '../hoc/WithUserStatus';

const Profile = props => {
	return (
		<div className="user-profile">
			<p>Coming soon</p>
		</div>
	);
};

export default WithUserStatus(Profile);
