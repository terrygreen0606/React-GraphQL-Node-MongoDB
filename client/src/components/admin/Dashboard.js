import React, { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import UsersTable from './UsersTable';

const Dashboard = () => {
	const [activeItem, setActiveItem] = useState('users');

	const handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<Grid>
			<Grid.Row className="page-title">
				<h1>Dashboard</h1>
			</Grid.Row>
			<Grid.Column width={3}>
				<Menu fluid vertical tabular>
					<Menu.Item
						name="users"
						active={activeItem === 'users'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						name="pics"
						active={activeItem === 'pics'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						name="companies"
						active={activeItem === 'companies'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						name="links"
						active={activeItem === 'links'}
						onClick={handleItemClick}
					/>
				</Menu>
			</Grid.Column>

			<Grid.Column stretched width={13}>
				<Segment>
					<UsersTable />
				</Segment>
			</Grid.Column>
		</Grid>
	);
};

export default Dashboard;
