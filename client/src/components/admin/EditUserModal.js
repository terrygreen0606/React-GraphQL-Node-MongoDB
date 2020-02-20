import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

import { EDIT_USER } from '../../graphql/usersQuery';

const EditUserModal = props => {
	const options = [
		{ key: 1, text: 'User', value: 9 },
		{ key: 2, text: 'Suspended', value: 8 },
		{ key: 3, text: 'Admin', value: 1 }
	];

	const [user, setUser] = useState(props.user);
	const handleChange = (e, { value }) => {
		const key = e.target.name ? e.target.name : 'roleType';
		setUser({ ...user, [key]: value });
	};

	const [errors, setErrors] = useState({});

	const [editUser, { loading }] = useMutation(EDIT_USER, {
		update(_, result) {
			props.close();
			toast({
				type: 'success',
				icon: 'alarm',
				title: 'User Updated',
				description: result.data.editUser,
				animation: 'fly up',
				time: 5000
			});
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		}
	});

	const handleSubmit = e => {
		e.preventDefault();
		const { username, email, password, roleType } = user;
		editUser({
			variables: { username, email, password, roleType, id: user.id }
		});
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
							value={user.username}
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
							value={user.email}
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
							placeholder="Select Role"
							label="Role"
							name="role"
							onChange={handleChange}
							required
							defaultValue={user.roleType}
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
							onClick={props.close}
							type="button"
						/>
						<Button
							primary
							icon="user"
							labelPosition="right"
							content="Edit User"
							type="submit"
						/>
					</Form>
				</Modal.Description>
			</Modal.Content>

			<SemanticToastContainer />
		</>
	);
};

export default EditUserModal;
