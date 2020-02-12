import React, { useState } from 'react';
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
			setDeleteLoading(false);
			setDeleteDisabled(false);
		},
		onError(err) {
			console.log(err);
			setDeleteLoading(false);
			setDeleteDisabled(false);
		}
	});

	const [addAdminRole] = useMutation(ADD_ADMIN_ROLE, {
		variables: { userId: user.id },
		update(proxy, result) {
			console.log(result.data.addAdminRole);
			setAddLoading(false);
			setAddDisabled(false);
		},
		onError(err) {
			console.log(err);
			setAddLoading(false);
			setAddDisabled(false);
		}
	});

	const [active, setActive] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [addDisabled, setAddDisabled] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteDisabled, setDeleteDisabled] = useState(false);

	const select = () => {
		setActive(!active);
	};

	return (
		<Table.Row active={active}>
			<Table.Cell collapsing>
				<Checkbox toggle onChange={select} />
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
						loading={addLoading}
						disabled={addDisabled}
						color="teal"
						onClick={() => {
							addAdminRole();
							setAddLoading(true);
							setAddDisabled(true);
						}}
					/>
				</Tooltip>
				<Tooltip content="Delete User">
					<Button
						icon="delete"
						loading={deleteLoading}
						disabled={deleteDisabled}
						onClick={() => {
							deleteUser();
							setDeleteLoading(true);
							setDeleteDisabled(true);
						}}
						color="red"
					/>
				</Tooltip>
			</Table.Cell>
		</Table.Row>
	);
};

export default SingleUser;
