import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../custom/userCustom';

const ForgotPassword = props => {
	const { onChange, onSubmit, values } = useForm(resetPassword, {
		email: '',
		password: ''
	});
	const [errors, setErrors] = useState({});

	// const [loginUser, { loading }] = useMutation(LOGIN_USER, {
	// 	// Comes from graphql server
	// 	update(proxy, result) {
	// 		context.login(result.data.login);
	// 		props.history.push('/posts');
	// 	},
	// 	onError(err) {
	// 		console.log(err.graphQLErrors[0]);
	// 		// console.log(err.graphQLErrors[0].extensions.exception.errors);
	// 		setErrors(err.graphQLErrors[0].extensions.exception.errors);
	// 	},
	// 	variables: values
	// });

	function resetPassword() {
		console.log(values);
		// loginUser();
		console.log('forgot password called?');
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit}>
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
				<Button type="submit" primary>
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
		</div>
	);
};

export default ForgotPassword;
