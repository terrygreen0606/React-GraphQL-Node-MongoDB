import React from 'react';
import { Container, Sidebar } from 'semantic-ui-react';
import UsersTable from './UsersTable';
import Sidenav from './Sidenav';

const Dashboard = () => {
	const animation = 'overlay';
	const direction = 'left';
	const visible = true;
	return (
		<Container fluid>
			<Sidebar.Pushable as="div">
				<Sidenav
					animation={animation}
					direction={direction}
					visible={visible}
				/>
				<Sidebar.Pusher>
					<UsersTable />
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</Container>
	);
};

export default Dashboard;
