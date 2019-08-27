const utils = require('./core/utils')
const checkAndNotify = require('./core/daily')
var schedule = require('node-schedule')

const withlogs = () => {
	checkAndNotify()
		.then(infos => {
			if (infos.length < 1) {
				console.log('no updates')
			} else {
				console.log('%s Messages sent', infos.length)
			}
			exit(0)
		}).catch(console.error)	
}

// run at 9am everyday
const dailyCheck = () => {
	var j = schedule.scheduleJob('0 0 9 * * *', withlogs)
}

const params = process.argv.slice(2)

if (params[0]) {
	switch(params[0]) {
		case 'startCron':
			dailyCheck()
			break
		case 'startOnce':
			withlogs()
			break
		case 'addListener':
			const mail = params[1]
			const name = params[2]
			const season = params[3] || 1
			console.log(`${mail}, ${name}, ${season}`)
			utils.addListener(mail, name, season)
				.then(x => console.log('successfully added'))
				.catch(console.error)
			break
	}
} else {
	withlogs()
}