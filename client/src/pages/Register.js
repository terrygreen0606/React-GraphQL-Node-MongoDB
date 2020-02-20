import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { UserContext } from '../context/UserContext';
import { REGISTER_USER } from '../graphql/usersQuery';
import { useForm } from '../custom/userCustom';

const Register = props => {
	const context = useContext(UserContext);
	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [errors, setErrors] = useState({});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, result) {
			// Dispatch login action in context
			context.login(result.data.register);
			props.history.push('/posts');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className="form-container">
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? 'loading' : ''}
			>
				<h1>Register</h1>
				<Form.Input
					placeholder="Username"
					name="username"
					type="text"
					error={errors.username ? true : false}
					value={values.username}
					onChange={onChange}
				/>
				<Form.Input
					placeholder="Email"
					name="email"
					type="email"
					error={errors.email ? true : false}
					value={values.email}
					onChange={onChange}
				/>
				<Form.Input
					placeholder="Password"
					name="password"
					type="password"
					error={errors.password ? true : false}
					value={values.password}
					onChange={onChange}
				/>
				<Form.Input
					placeholder="Confirm Password"
					name="confirmPassword"
					type="password"
					error={errors.confirmPassword ? true : false}
					value={values.confirmPassword}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Register
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

export default Register;
