import React, { useState } from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import UsersTable from './UsersTable';

const Dashboard = () => {
	const [activeItem, setActiveItem] = useState('users');

	const handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<Grid>
			<Grid.Column width={3}>
				<Menu fluid vertical tabular>
					<Menu.Item
						icon="users"
						name="users"
						active={activeItem === 'users'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						icon="list"
						name="posts"
						active={activeItem === 'posts'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						icon="settings"
						name="settings"
						active={activeItem === 'settings'}
						onClick={handleItemClick}
					/>
					<Menu.Item
						name="links"
						active={activeItem === 'links'}
						onClick={handleItemClick}
					/>
				</Menu>
			</Grid.Column>

			<Grid.Column stretched width={12}>
				<UsersTable />
			</Grid.Column>
		</Grid>
	);
};

export default Dashboard;
