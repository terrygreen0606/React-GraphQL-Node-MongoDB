import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';
import { UserProvider } from './context/UserContext';
import AuthRoutes from './custom/AuthRoutes';
import ProtectedRoutes from './custom/ProtectedRoutes';

import Posts from './pages/Posts';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import SinglePost from './components/posts/SinglePost';
import Profile from './components/profile/Profile';
import UsersTable from './components/admin/UsersTable';

function App() {
	return (
		<UserProvider>
			<Router>
				<Container>
					<MenuBar />
					<Switch>
						<AuthRoutes exact path="/login" component={Login} />
						<AuthRoutes
							exact
							path="/register"
							component={Register}
						/>

						<Route exact path="/posts" component={Posts} />
						<Route
							exact
							path="/posts/:postId"
							component={SinglePost}
						/>

						<ProtectedRoutes
							exact
							path="/profile"
							component={Profile}
						/>

						<Route
							exact
							path="/admin/users"
							component={UsersTable}
						/>
					</Switch>
				</Container>
			</Router>
		</UserProvider>
	);
}

export default App;
