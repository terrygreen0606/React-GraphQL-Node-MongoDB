import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Button } from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import { useForm } from '../custom/userCustom';
import { FORGOT_PASSWORD } from '../graphql/usersQuery';

const ForgotPassword = () => {
	const { onChange, onSubmit, values } = useForm(forgotPassword, {
		email: ''
	});
	const [errors, setErrors] = useState({});

	const [forgot, { loading }] = useMutation(FORGOT_PASSWORD, {
		variables: { email: values.email },
		update(_, result) {
			toast({
				type: 'success',
				icon: 'alarm',
				title: 'User Updated',
				description: result.data.forgotPassword,
				animation: 'fly up',
				time: 5000
			});
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].errors.email);
		}
	});

	function forgotPassword() {
		forgot();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} loading={loading}>
				<h1>Send email Link</h1>
				<Form.Input
					placeholder="Email"
					name="email"
					type="email"
					error={errors.email ? true : false}
					value={values.email}
					onChange={onChange}
					required
				/>
				<Button type="submit" primary>
					Send me Email to change the password
				</Button>
			</Form>

			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map(error => (
							<li key={error}>{error}</li>
						))}
					</ul>
				</div>
			)}

			<SemanticToastContainer />
		</div>
	);
};

export default ForgotPassword;
