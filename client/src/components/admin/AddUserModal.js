import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

import { ADD_USER } from '../../graphql/usersQuery';

const AddUserModal = ({ close }) => {
	const options = [
		{ key: 1, text: 'Admin', value: 1 },
		{ key: 2, text: 'Suspended', value: 8 },
		{ key: 3, text: 'User', value: 9 }
	];

	const [inputData, setInputData] = useState({});

	const handleChange = (e, { value }) => {
		const key = e.target.name ? e.target.name : 'roleType';
		setInputData({ ...inputData, [key]: value });
	};

	const [errors, setErrors] = useState({});

	const [addNewUser, { loading }] = useMutation(ADD_USER, {
		update() {
			close();
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		}
	});

	const handleSubmit = e => {
		e.preventDefault();
		addNewUser({ variables: inputData });
	};

	return (
		<>
			<Modal.Header>Add User</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<Header>Enter user info below</Header>
					<Form onSubmit={handleSubmit} loading={loading}>
						<Form.Input
							placeholder="Username"
							type="text"
							name="username"
							fluid
							label="Username"
							onChange={handleChange}
							required
							error={
								errors.username && {
									content: errors.username,
									pointing: 'below'
								}
							}
						/>
						<Form.Input
							placeholder="Email"
							type="email"
							name="email"
							fluid
							label="Email"
							onChange={handleChange}
							required
							error={
								errors.email && {
									content: errors.email,
									pointing: 'below'
								}
							}
						/>
						<Form.Input
							placeholder="Password"
							type="password"
							name="password"
							fluid
							label="Password"
							onChange={handleChange}
							required
							error={
								errors.password && {
									content: errors.password,
									pointing: 'below'
								}
							}
						/>
						<Form.Dropdown
							options={options}
							selection
							defaultValue={0}
							label="Role"
							name="role"
							onChange={handleChange}
							required
							error={
								errors.roleType && {
									content: errors.roleType,
									pointing: 'below'
								}
							}
						/>
						<Button
							icon="cancel"
							labelPosition="right"
							content="Cancel"
							onClick={close}
							type="button"
						/>
						<Button
							primary
							icon="user"
							labelPosition="right"
							content="Add User"
							type="submit"
						/>
					</Form>
				</Modal.Description>
			</Modal.Content>
		</>
	);
};

export default AddUserModal;
