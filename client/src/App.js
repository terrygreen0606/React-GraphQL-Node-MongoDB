import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';
import { UserProvider } from './context/UserContext';
import AuthRoutes from './custom/AuthRoutes';

import Posts from './pages/Posts';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import SinglePost from './components/posts/SinglePost';

function App() {
	return (
		<UserProvider>
			<Router>
				<Container>
					<MenuBar />
					<Switch>
						<Route exact path="/posts" component={Posts} />
						<AuthRoutes exact path="/login" component={Login} />
						<AuthRoutes
							exact
							path="/register"
							component={Register}
						/>

						<Route
							exact
							path="/posts/:postId"
							component={SinglePost}
						/>
					</Switch>
				</Container>
			</Router>
		</UserProvider>
	);
}

export default App;
