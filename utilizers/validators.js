module.exports.validateRegisterInput = userInputData => {
	const { email, username, password, confirmPassword } = userInputData;
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Username is required';
	}

	if (email.trim() === '') {
		errors.email = 'Email is required';
	} else {
		// Validate email
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = 'Email is invalid';
		}
	}

	if (password === '' || confirmPassword === '') {
		errors.password = 'Password is required';
	} else if (password !== confirmPassword) {
		errors.password = 'Passwords do not match';
	}

	return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateLoginInput = userInputData => {
	const { email, password } = userInputData;
	const errors = {};

	if (email.trim() === '') {
		errors.email = 'Email is required';
	} else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = 'Email is invalid';
		}
	}

	if (password === '') {
		errors.password = 'Password is required';
	}

	return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateAddUserInput = userInputData => {
	const { email, username, password, role } = userInputData;
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Username is required';
	}

	if (password === '') {
		errors.password = 'Password is required';
	}

	if (role === '') {
		errors.role = 'Select the role';
	}

	if (email.trim() === '') {
		errors.email = 'Email is required';
	} else {
		// Validate email
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = 'Email is invalid';
		}
	}

	return { errors, valid: Object.keys(errors).length < 1 };
};
