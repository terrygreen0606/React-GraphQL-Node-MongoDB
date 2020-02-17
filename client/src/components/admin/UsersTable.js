import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
	Button,
	Icon,
	Table,
	Transition,
	Grid,
	Input,
	Dropdown,
	Pagination,
	Loader
} from 'semantic-ui-react';

import { LOAD_USERS } from '../../graphql/usersQuery';
import SingleUser from './SingleUser';

const UsersTable = () => {
	const { loading, error, data } = useQuery(LOAD_USERS);

	const options = [
		{ key: 1, text: 'Username', value: 1 },
		{ key: 2, text: 'Email', value: 2 },
		{ key: 3, text: 'Role', value: 3 }
	];

	let userIds = [];
	const select = (selected, userId) => {
		selected
			? (userIds = userIds.filter(id => id !== userId))
			: userIds.push(userId);
	};

	const selectCategory = (e, { value }) => {
		console.log(value);
	};

	const selectAll = () => {
		console.log('clicked select all');
	};

	const deleteAll = () => {
		console.log(userIds);
	};

	const paginate = (e, { activePage }) => {
		console.log(activePage);
	};

	let table;
	if (loading) {
		table = <Loader size="massive" active inline="centered" />;
	} else if (error) {
		table = <h1>Error...</h1>;
	} else {
		const users = data.getUsers;
		table = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={3} floated="right">
						<Input loading icon="user" placeholder="Search..." />
					</Grid.Column>
					<Grid.Column width={3}>
						<Dropdown
							onChange={selectCategory}
							options={options}
							selection
							defaultValue={1}
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Table celled compact definition selectable>
						<Table.Header fullWidth>
							<Table.Row>
								<Table.HeaderCell textAlign="center">
									#
								</Table.HeaderCell>
								<Table.HeaderCell>Username</Table.HeaderCell>
								<Table.HeaderCell>
									Registration Date
								</Table.HeaderCell>
								<Table.HeaderCell>
									E-mail address
								</Table.HeaderCell>
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
									<SingleUser
										user={user}
										key={user.id}
										select={select}
									/>
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
									<Button size="small" onClick={selectAll}>
										Select all
									</Button>
									<Button size="small" onClick={deleteAll}>
										Delete Selected
									</Button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				</Grid.Row>
				<Grid.Row centered>
					<Pagination
						defaultActivePage={1}
						totalPages={10}
						onPageChange={paginate}
					/>
				</Grid.Row>
			</Grid>
		);
	}
	return table;
};

export default UsersTable;
