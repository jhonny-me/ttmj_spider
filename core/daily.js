const mailer = require('../lib/mail/mailer')
const utils = require('./utils')
const listener = require('../lib/mongod/listeners')

// check and notify
const index = () => {
	return utils.seriesUpdateCheck().then(updates => {
		return listener.read().then(values => {
			values.client.close()
			const result = values.result
			const mailList = []
			result.forEach(r => {
				const needsNotify = updates.filter(u => r.listenTo.find(l => l.name === u.origin.name) > 0)
				if (needsNotify.length > 0) {
					// notify
					mailList.push(mailer(needsNotify, r.mail))
				}
			})
			return Promise.all(mailList)
		})
	})
}

module.exports = index