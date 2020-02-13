import React from 'react';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Table } from 'semantic-ui-react';

import {
	LOAD_USERS,
	DELETE_USER,
	ADD_ADMIN_ROLE
} from '../../graphql/usersQuery';
import Tooltip from '../../custom/Tooltip';

const SingleUser = ({ user }) => {
	const [deleteUser] = useMutation(DELETE_USER, {
		variables: { userId: user.id },
		update(proxy) {
			// Remove from cache
			const data = proxy.readQuery({
				query: LOAD_USERS
			});
			const usersAfterDeleted = data.getUsers.filter(
				userFiltered => userFiltered.id !== user.id
			);
			proxy.writeQuery({
				query: LOAD_USERS,
				data: { getUsers: usersAfterDeleted }
			});
		},
		onError(err) {
			console.log(err);
		}
	});

	const [addAdminRole] = useMutation(ADD_ADMIN_ROLE, {
		variables: { userId: user.id },
		update(proxy, result) {
			console.log(result.data.addAdminRole);
		},
		onError(err) {
			console.log(err);
		}
	});

	const selectChecked = () => {
		console.log('onchange?');
	};

	return (
		<Table.Row>
			<Table.Cell collapsing>
				<Checkbox toggle onChange={selectChecked} />
			</Table.Cell>
			<Table.Cell>{user.username}</Table.Cell>
			<Table.Cell>{moment(user.createdAt).format('LL')}</Table.Cell>
			<Table.Cell>{user.email}</Table.Cell>
			<Table.Cell>{user.roleType === 1 ? 'Admin' : 'User'}</Table.Cell>
			<Table.Cell>{user.posts.length}</Table.Cell>
			<Table.Cell>{user.comments.length}</Table.Cell>
			<Table.Cell textAlign="center">
				<Tooltip content="Add admin role">
					<Button
						icon="paw"
						color="teal"
						onClick={() => {
							addAdminRole();
						}}
					/>
				</Tooltip>
				<Tooltip content="Delete User">
					<Button
						icon="delete"
						onClick={() => {
							deleteUser();
						}}
						color="red"
					/>
				</Tooltip>
			</Table.Cell>
		</Table.Row>
	);
};

export default SingleUser;
