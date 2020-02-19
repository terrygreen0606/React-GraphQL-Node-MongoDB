import React, { useState, useEffect } from 'react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Table, Dropdown } from 'semantic-ui-react';

import { LOAD_USERS, DELETE_USER, ADD_ROLE } from '../../graphql/usersQuery';
import Tooltip from '../../custom/Tooltip';

const SingleUser = ({ user, select, allPick }) => {
	const options = [
		{ key: 1, text: 'Make Admin', icon: 'chess king', value: 1 },
		{ key: 2, text: 'Suspend User', icon: 'ban', value: 8 },
		{ key: 3, text: 'Make User', icon: 'user', value: 9 }
	];

	const [suspendedColor, setSuspendedColor] = useState(false);
	const [adminColor, setAdminColor] = useState(false);
	const [selected, setSelected] = useState(false);
	useEffect(() => {
		user.roleType === 8 && setSuspendedColor(true);
		user.roleType === 1 && setAdminColor(true);
	}, [setSuspendedColor, user]);

	useEffect(() => {
		setSelected(allPick);
	}, [allPick]);

	const [deleteUser] = useMutation(DELETE_USER, {
		variables: { userId: user.id },
		update(proxy, result) {
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

			toast({
				type: 'success',
				icon: 'alarm',
				title: 'User Deleted',
				description: result.data.deleteUser,
				animation: 'fly up',
				time: 5000
			});
		},
		onError(err) {
			console.log(err);
		}
	});

	const [addRole] = useMutation(ADD_ROLE, {
		update(proxy, result) {
			toast({
				type: 'success',
				icon: 'alarm',
				title: 'Role Change',
				description: result.data.addRole,
				animation: 'fly up',
				time: 5000
			});
		},
		onError({ graphQLErrors, networkError, operation, forward }) {
			console.log(networkError);
		}
	});

	const changeRole = (e, { value }) => {
		addRole({ variables: { userId: user.id, roleType: value } });
	};

	const selectChecked = () => {
		setSelected(!selected);
		select(selected, user.id);
	};

	return (
		<Table.Row
			active={selected}
			positive={adminColor}
			negative={suspendedColor}
		>
			<Table.Cell collapsing>
				<Checkbox toggle onChange={selectChecked} checked={selected} />
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
						selectOnBlur={false}
						onChange={changeRole}
						defaultValue={null}
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

				<SemanticToastContainer />
			</Table.Cell>
		</Table.Row>
	);
};

export default SingleUser;
