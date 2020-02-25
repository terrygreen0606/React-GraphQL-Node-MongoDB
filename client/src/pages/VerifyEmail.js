import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { VERIFY_EMAIL } from '../graphql/usersQuery';
import { Button, Grid } from 'semantic-ui-react';

const VerifyEmail = props => {
	const [message, setMessage] = useState(null);
	const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL, {
		update(_, result) {
			result.data.verifyEmail
				? setMessage('Your email is successfully verified')
				: setMessage(
						'This link is invalid or expired. Try again with the button below.'
				  );
		},
		onError(err) {
			console.log(err);
			setMessage('Error Occurred verifying your email');
		}
	});

	useEffect(() => {
		verifyEmail({ variables: { token: props.match.params.token } });
	}, [verifyEmail, props.match.params.token]);

	// const resendLink = () => {
	// 	console.log('clicked resend link');
	// };

	return (
		<Grid textAlign="center">
			<Grid.Row>
				<p>{loading ? 'Loading...' : message}</p>
			</Grid.Row>
			<Grid.Row>
				<Button primary>Resend Link</Button>
			</Grid.Row>
		</Grid>
	);
};

export default VerifyEmail;
