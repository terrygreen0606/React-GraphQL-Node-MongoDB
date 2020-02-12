import React from 'react';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react';

const UsersTable = () => (
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
				<Table.HeaderCell>Actions</Table.HeaderCell>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			<Table.Row>
				<Table.Cell collapsing>
					<Checkbox slider />
				</Table.Cell>
				<Table.Cell>John Lilki</Table.Cell>
				<Table.Cell>September 14, 2013</Table.Cell>
				<Table.Cell>jhlilk22@yahoo.com</Table.Cell>
				<Table.Cell>Admin</Table.Cell>
				<Table.Cell>12</Table.Cell>
				<Table.Cell>243</Table.Cell>
				<Table.Cell>No</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell collapsing>
					<Checkbox slider />
				</Table.Cell>
				<Table.Cell>Jamie Harington</Table.Cell>
				<Table.Cell>January 11, 2014</Table.Cell>
				<Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
				<Table.Cell>Super</Table.Cell>
				<Table.Cell>25</Table.Cell>
				<Table.Cell>1</Table.Cell>
				<Table.Cell>Yes</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell collapsing>
					<Checkbox slider />
				</Table.Cell>
				<Table.Cell>Jill Lewis</Table.Cell>
				<Table.Cell>May 11, 2014</Table.Cell>
				<Table.Cell>jilsewris22@yahoo.com</Table.Cell>
				<Table.Cell>User</Table.Cell>
				<Table.Cell>2</Table.Cell>
				<Table.Cell>4</Table.Cell>
				<Table.Cell>Yes</Table.Cell>
			</Table.Row>
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

export default UsersTable;
