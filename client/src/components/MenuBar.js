import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';

import { UserContext } from '../context/UserContext';

const MenuBar = () => {
	const { user, logout } = useContext(UserContext);
	const pathname = window.location.pathname;
	const path = pathname === '/' ? 'home' : pathname.substr(1);
	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (e, { name }) => setActiveItem(name);

	const links = user ? (
		<>
			<Menu.Menu position="right">
				<Dropdown
					text={user.username}
					pointing
					className="link item"
					icon="options"
				>
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/profile">
							<Icon name="user" />
							Profile
						</Dropdown.Item>
						<Dropdown.Item onClick={logout} as={Link} to="/">
							<Icon name="sign-out" />
							Logout
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>
		</>
	) : (
		<>
			<Menu.Menu position="right">
				<Menu.Item
					name="login"
					active={activeItem === 'login'}
					onClick={handleItemClick}
					as={Link}
					to="/login"
				/>
				<Menu.Item
					name="register"
					active={activeItem === 'register'}
					onClick={handleItemClick}
					as={Link}
					to="/register"
				/>
			</Menu.Menu>
		</>
	);

	// return links;
	return (
		<Menu pointing secondary size="massive" color="teal">
			<Menu.Item
				name="home"
				active={activeItem === 'home'}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>
			<Menu.Item
				name="posts"
				active={activeItem === 'posts'}
				onClick={handleItemClick}
				as={Link}
				to="/posts"
			/>
			{links}
		</Menu>
	);
};

export default MenuBar;
