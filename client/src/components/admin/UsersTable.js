import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Button, Icon, Table, Transition } from 'semantic-ui-react';

import { LOAD_USERS } from '../../graphql/usersQuery';
import SingleUser from './SingleUser';

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
					<Transition.Group>
						{users.map(user => (
							<SingleUser user={user} key={user.id} />
						))}
					</Transition.Group>
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
