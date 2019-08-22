const nodemailer = require('nodemailer')
const {newEpsoild} = require('./templates')

const account126 = {
	user: 'ttmj_spider@126.com',
	pwd: 'ttmj126'
}

const index = async (inputName, json, mailTo) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.126.com',
		port: 25,
		auth: {
			user: account126.user,
			pass: account126.pwd
		}
	})

	const mail = newEpsoild(inputName, json)

	let info = await transporter.sendMail({
		from: account126.user,
		cc: account126.user,
		to: mailTo,
		subject: mail.subject,
		html: mail.message
	})

	console.log('Message sent: %s', info.messageId)
}

module.exports = index