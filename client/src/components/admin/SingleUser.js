import React from 'react';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Table, Dropdown } from 'semantic-ui-react';

import { LOAD_USERS, DELETE_USER, ADD_ROLE } from '../../graphql/usersQuery';
import Tooltip from '../../custom/Tooltip';

const SingleUser = ({ user }) => {
	const options = [
		{ key: 1, text: 'Make Admin', icon: 'chess king', value: 1 },
		{ key: 2, text: 'Suspend User', icon: 'ban', value: 8 },
		{ key: 3, text: 'Make User', icon: 'user', value: 9 }
	];

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

	const [addRole] = useMutation(ADD_ROLE, {
		update(proxy, result) {
			console.log(result.data.addRole);
		},
		onError(err) {
			console.log(err);
		}
	});

	const changeRole = (e, { value }) => {
		addRole({ variables: { userId: user.id, roleType: value } });
	};

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
			<Table.Cell>
				{user.roleType === 1
					? 'Admin'
					: user.roleType === 8
					? 'Suspended'
					: 'User'}
			</Table.Cell>
			<Table.Cell>{user.posts.length}</Table.Cell>
			<Table.Cell>{user.comments.length}</Table.Cell>
			<Table.Cell textAlign="center">
				<Tooltip content="Add role">
					<Dropdown
						trigger={<Button icon="paw" color="teal" />}
						options={options}
						pointing="top left"
						onChange={changeRole}
						icon={null}
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
