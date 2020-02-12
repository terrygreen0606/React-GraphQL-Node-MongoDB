import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const inititalState = {
	user: null
};

const decode = () => {
	if (localStorage.getItem('jwtToken')) {
		const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

		// decodedToken.exp = expire time of token
		// Check if the expire time exceeded now.
		if (decodedToken.exp * 1000 < Date.now()) {
			localStorage.removeItem('jwtToken');
		} else {
			inititalState.user = decodedToken;
		}
	}
};

decode();

const UserContext = createContext({
	user: null,
	login: userData => {},
	logout: () => {}
});

function userReducer(state, action) {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				user: action.payload
			};

		case 'LOGOUT':
			return { ...state, user: null };

		default:
			return state;
	}
}

function UserProvider(props) {
	const [state, dispatch] = useReducer(userReducer, inititalState);

	function login(userData) {
		localStorage.setItem('jwtToken', userData.token);
		decode();
		dispatch({
			type: 'LOGIN',
			payload: inititalState.user
		});
	}

	function logout() {
		localStorage.removeItem('jwtToken');
		dispatch({
			type: 'LOGOUT'
		});
	}

	return (
		<UserContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		/>
	);
}

export { UserContext, UserProvider };
