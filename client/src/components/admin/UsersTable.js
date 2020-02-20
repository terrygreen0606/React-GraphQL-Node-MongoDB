import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
	Button,
	Table,
	Transition,
	Grid,
	Input,
	Dropdown,
	Pagination,
	Loader,
	Modal
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import AddUserModal from './AddUserModal';
import { LOAD_PAGINATED_USERS, DELETE_USERS } from '../../graphql/usersQuery';
import { UserContext } from '../../context/UserContext';
import SingleUser from './SingleUser';

const UsersTable = () => {
	const { logout } = useContext(UserContext);
	const itemsPerPage = 10;
	const defaultActivePage = 1;

	const { loading, error, data, fetchMore } = useQuery(LOAD_PAGINATED_USERS, {
		variables: { itemsPerPage, activePage: defaultActivePage },
		fetchPolicy: 'cache-and-network'
	});

	const [deleteUsers] = useMutation(DELETE_USERS, {
		update(_, result) {
			toast({
				type: 'success',
				icon: 'alarm',
				title: 'Users Deleted',
				description: `${result.data.deleteUsers}. Refresh to filter.`,
				animation: 'fly up',
				time: 5000
			});
		},
		onError(err) {
			toast({
				type: 'error',
				icon: 'alarm',
				title: 'Users Deleted',
				description: `${err.graphQLErrors[0].message}`,
				animation: 'fly up',
				time: 5000
			});
		}
	});

	const options = [
		{ key: 1, text: 'All', value: 0 },
		{ key: 2, text: 'User', value: 9 },
		{ key: 3, text: 'Suspended', value: 8 },
		{ key: 4, text: 'Admin', value: 1 }
	];

	const [userIds, setUserIds] = useState([]);
	const [allPick, setAllPick] = useState(false);

	const select = (selected, userId) => {
		selected
			? setUserIds(userIds.filter(id => id !== userId))
			: setUserIds(prev => [...prev, userId]);
	};

	const selectCategory = (e, { value }) => {
		console.log(value);
	};

	const deleteAll = () => {
		deleteUsers({ variables: { userIds } });
	};

	const [activePage, setActivePage] = useState(1);
	const paginate = (e, { activePage }) => {
		setActivePage(activePage);
		fetchMore({
			variables: { itemsPerPage, activePage },
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) return prev;
				return Object.assign({}, prev, {
					getUserInfo: fetchMoreResult.getUserInfo
				});
			}
		}).catch(err => {
			// Errors like token expired
			console.log(err);
			logout();
		});
	};

	const [open, setOpen] = useState(false);

	const showModal = () => {
		setOpen(true);
	};

	const close = () => {
		setOpen(false);
	};

	let table;
	if (loading) {
		table = <Loader size="massive" active inline="centered" />;
	} else if (error) {
		table = <h1>Error...</h1>;
	} else {
		const { users, total } = data.getUserInfo;
		const selectAll = () => {
			setAllPick(!allPick);
			let ids = [];
			!allPick && users.map(user => ids.push(user.id));
			setUserIds(ids);
		};
		table = (
			<Grid divided="vertically">
				<Grid.Row columns={2}>
					<Grid.Column>
						<Input loading icon="user" placeholder="Search..." />
					</Grid.Column>
					<Grid.Column>
						<Dropdown
							onChange={selectCategory}
							options={options}
							selection
							placeholder="Filter by"
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
										allPick={allPick}
										close={close}
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
										labelPosition="right"
										primary
										size="small"
										onClick={showModal}
										content="Add User"
										icon="user"
									/>
									<Button
										size="small"
										onClick={selectAll}
										color="teal"
									>
										{allPick ? 'Uncheck All' : 'Select all'}
									</Button>
									<Button
										size="small"
										onClick={deleteAll}
										color="red"
									>
										Delete Selected
									</Button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				</Grid.Row>
				<Grid.Row centered>
					<Pagination
						activePage={activePage}
						totalPages={Math.ceil(total / itemsPerPage)}
						onPageChange={paginate}
					/>
				</Grid.Row>

				<Modal
					dimmer="inverted"
					open={open}
					closeOnDimmerClick={false}
					centered={false}
				>
					<AddUserModal close={close} />
				</Modal>

				<SemanticToastContainer />
			</Grid>
		);
	}
	return table;
};

export default UsersTable;
