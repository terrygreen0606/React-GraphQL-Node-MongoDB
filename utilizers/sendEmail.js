const config = require('config');
const nodeoutlook = require('nodejs-nodemailer-outlook');
const { UserInputError } = require('apollo-server');

module.exports = (user, token, emailOrPassword) => {
	const link =
		emailOrPassword === 'email'
			? `http://localhost:3000/verify/${token}`
			: `http://localhost:3000/reset/${token}`;

	return new Promise((resolve, reject) => {
		nodeoutlook.sendEmail({
			auth: {
				user: config.get('email.user'),
				pass: config.get('email.pass')
			},
			from: config.get('email.user'),
			to: user.email,
			subject: 'Reset Password',
			text: `To reset password, click the link: ${link}`,
			onError: err => {
				console.log('There was an error while sending email.', err);
				reject(
					new UserInputError('Errors', {
						errors: {
							email:
								'There caused an error while sending email. Perhaps your email address went wrong.'
						}
					})
				);
			},
			onSuccess: response => {
				console.log('This is the response.', response);
				resolve(
					'Verification Email sent. This email is valid for only an hour. If you can not see the email in your inbox, take a look at Junk email box and click the link there to reset your password.'
				);
			}
		});
	});
};
