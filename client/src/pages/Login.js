import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { UserContext } from '../context/UserContext';
import { LOGIN_USER } from '../graphql/usersQuery';
import { useForm } from '../custom/userCustom';

const Login = props => {
	const context = useContext(UserContext);
	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		email: '',
		password: ''
	});
	const [errors, setErrors] = useState({});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		// Comes from graphql server
		update(proxy, result) {
			context.login(result.data.login);
			props.history.push('/posts');
		},
		onError(err) {
			console.log(err.graphQLErrors[0]);
			// console.log(err.graphQLErrors[0].extensions.exception.errors);
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? 'loading' : ''}
			>
				<h1>Log In</h1>
				<Form.Input
					label="Email"
					placeholder="Email"
					name="email"
					type="email"
					error={errors.email ? true : false}
					value={values.email}
					onChange={onChange}
				/>
				<Form.Input
					label="Password"
					placeholder="Password"
					name="password"
					type="password"
					error={errors.password ? true : false}
					value={values.password}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Log In
				</Button>
				<Input as={Link} to="/forgot">
					Forgot Password?
				</Input>
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

export default Login;
