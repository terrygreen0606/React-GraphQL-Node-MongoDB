import React from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react';

import { LOAD_USERS } from '../../graphql/usersQuery';

const UsersTable = () => {
	const { loading, error, data } = useQuery(LOAD_USERS);

	let table;
	if (loading) {
		table = <h1>Loading...</h1>;
	} else if (error) {
		table = <h1>Error...</h1>;
	} else {
		const users = data.getUsers;
		table = (
			<Table celled compact definition>
				<Table.Header fullWidth>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell>Username</Table.HeaderCell>
						<Table.HeaderCell>Registration Date</Table.HeaderCell>
						<Table.HeaderCell>E-mail address</Table.HeaderCell>
						<Table.HeaderCell>Role</Table.HeaderCell>
						<Table.HeaderCell>Posts</Table.HeaderCell>
						<Table.HeaderCell>Comments</Table.HeaderCell>
						<Table.HeaderCell textAlign="center">
							Actions
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{users.map(user => (
						<Table.Row key={user.id}>
							<Table.Cell collapsing>
								<Checkbox slider />
							</Table.Cell>
							<Table.Cell>{user.username}</Table.Cell>
							<Table.Cell>
								{moment(user.createdAt).format('LL')}
							</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>
								{user.roleType === 1 ? 'Admin' : 'User'}
							</Table.Cell>
							<Table.Cell>{user.posts.length}</Table.Cell>
							<Table.Cell>{user.comments.length}</Table.Cell>
							<Table.Cell textAlign="center">
								<Button icon="paw" />
								<Button icon="delete" />
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>

				<Table.Footer fullWidth>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell colSpan="7">
							<Button
								floated="right"
								icon
								labelPosition="left"
								primary
								size="small"
							>
								<Icon name="user" /> Add User
							</Button>
							<Button size="small">Approve</Button>
							<Button disabled size="small">
								Approve All
							</Button>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		);
	}
	return table;
};

export default UsersTable;
