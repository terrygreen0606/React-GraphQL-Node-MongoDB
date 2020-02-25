import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import './App.css';
import { UserProvider } from './context/UserContext';
import AuthRoutes from './custom/AuthRoutes';
import ProtectedRoutes from './custom/ProtectedRoutes';

import Posts from './pages/Posts';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MenuBar from './components/MenuBar';
import SinglePost from './components/posts/SinglePost';
import Profile from './components/profile/Profile';
import Dashboard from './components/admin/Dashboard';
import VerifyEmail from './pages/VerifyEmail';

function App() {
	return (
		<UserProvider>
			<Router>
				<Container>
					<MenuBar />
				</Container>

				<Switch>
					<AuthRoutes exact path="/login" component={Login} />
					<AuthRoutes exact path="/register" component={Register} />
					<AuthRoutes
						exact
						path="/forgot"
						component={ForgotPassword}
					/>
					<AuthRoutes
						exact
						path="/reset/:token"
						component={ResetPassword}
					/>
					<AuthRoutes
						exact
						path="/verify/:token"
						component={VerifyEmail}
					/>

					<Route exact path="/posts" component={Posts} />
					<Route exact path="/posts/:postId" component={SinglePost} />

					<ProtectedRoutes
						exact
						path="/profile"
						component={Profile}
					/>
					<ProtectedRoutes
						exact
						path="/admin/dashboard"
						component={Dashboard}
					/>
				</Switch>
			</Router>
		</UserProvider>
	);
}

export default App;
