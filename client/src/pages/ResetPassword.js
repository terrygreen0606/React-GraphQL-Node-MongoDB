import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../custom/userCustom';
import { RESET_PASSWORD, UPDATE_PASSWORD } from '../graphql/usersQuery';

const ForgotPassword = props => {
	const { onChange, onSubmit, values } = useForm(updatePassword, {
		email: '',
		password: ''
	});

	const { loading, data, error } = useQuery(RESET_PASSWORD, {
		variables: { token: props.match.params.token }
	});

	const [update, updating] = useMutation(UPDATE_PASSWORD, {
		update(_, result) {
			toast({
				type: 'success',
				icon: 'alarm',
				title: 'User Updated',
				description: result.data.updatePassword,
				animation: 'fly up',
				time: 3000
			});
			setTimeout(() => {
				props.history.push('/login');
			}, 3000);
		},
		onError(err) {
			toast({
				type: 'error',
				icon: 'alarm',
				title: 'User Updated',
				description: 'Error occurred updating your password',
				animation: 'fly up',
				time: 5000
			});
		}
	});

	const [errors, setErrors] = useState({});
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		if (data) {
			data.resetPassword ? setDisabled(false) : setDisabled(true);
		}
	}, [data]);

	let invalidLink = disabled ? (
		<div className="ui error message">
			<ul className="list">
				<li>This link is invalid or expired.</li>
			</ul>
		</div>
	) : null;

	if (error) {
		setErrors(error.graphQLErrors[0].extensions.errors.email);
	}

	function updatePassword() {
		update({ variables: values });
	}

	return (
		<div className="form-container">
			{invalidLink}
			<Form onSubmit={onSubmit} loading={loading || updating.loading}>
				<h1>Reset Password</h1>
				<Form.Input
					placeholder="Email"
					name="email"
					type="email"
					error={errors.email ? true : false}
					value={values.email}
					onChange={onChange}
					required
				/>
				<Form.Input
					placeholder="Password"
					name="password"
					type="password"
					error={errors.password ? true : false}
					value={values.password}
					onChange={onChange}
					required
				/>
				<Button type="submit" primary disabled={disabled}>
					Reset Password
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
