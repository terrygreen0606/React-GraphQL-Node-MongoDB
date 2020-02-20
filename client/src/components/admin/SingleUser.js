import React, { useState, useEffect } from 'react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Table, Dropdown, Modal } from 'semantic-ui-react';

import { ADD_ROLE } from '../../graphql/usersQuery';
import EditUserModal from './EditUserModal';
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
	const [open, setOpen] = useState(false);

	const showModal = () => {
		setOpen(true);
	};

	const close = () => {
		setOpen(false);
	};

	useEffect(() => {
		user.roleType === 8 && setSuspendedColor(true);
		user.roleType === 1 && setAdminColor(true);
	}, [setSuspendedColor, user]);

	useEffect(() => {
		setSelected(allPick);
	}, [allPick]);

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
				<Tooltip content="Edit User">
					<Button icon="edit" primary onClick={showModal} />
				</Tooltip>

				<Modal
					dimmer="inverted"
					open={open}
					closeOnDimmerClick={false}
					centered={false}
					onClose={close}
				>
					<EditUserModal close={close} user={user} />
				</Modal>

				<SemanticToastContainer />
			</Table.Cell>
		</Table.Row>
	);
};

export default SingleUser;
