import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../custom/userCustom';

const ForgotPassword = props => {
	const { onChange, onSubmit, values } = useForm(forgotPassword, {
		email: ''
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

	function forgotPassword() {
		console.log(values);
		// loginUser();
		console.log('forgot password called?');
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit}>
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
		</div>
	);
};

export default ForgotPassword;
