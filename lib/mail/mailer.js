const nodemailer = require('nodemailer')
const templates = require('./templates')
const fs = require('fs')

const mailInfo = JSON.parse(fs.readFileSync(__dirname + '/../../config.json', 'utf8')).mailer

const index = (notifies, mailTo) => {
	const transporter = nodemailer.createTransport({
		host: mailInfo.host,
		port: mailInfo.port,
		auth: {
			user: mailInfo.user,
			pass: mailInfo.pwd
		}
	})

	const mail = templates.newEpisodes(notifies)

	return transporter.sendMail({
		from: mailInfo.user,
		cc: mailInfo.user,
		to: mailTo,
		subject: mail.subject,
		html: mail.message
	})
}

module.exports = index