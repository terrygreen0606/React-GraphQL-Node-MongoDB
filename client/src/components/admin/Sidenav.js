import React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

const Sidenav = ({ animation, direction, visible }) => {
	return (
		<Sidebar
			as={Menu}
			animation={animation}
			direction={direction}
			icon="labeled"
			inverted
			vertical
			visible={visible}
			width="thin"
		>
			<Menu.Item as="a">
				<Icon name="home" />
				Home
			</Menu.Item>
			<Menu.Item as="a">
				<Icon name="gamepad" />
				Games
			</Menu.Item>
			<Menu.Item as="a">
				<Icon name="camera" />
				Channels
			</Menu.Item>
		</Sidebar>
	);
};

export default Sidenav;
