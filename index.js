const mailer = require('./lib/mail/mailer')
const series = require('./lib/mongod/series')
const listener = require('./lib/mongod/listeners')
const spider = require('./lib/ttmj_spider')

const seriesUpdateCheck = () => {
	return series.read().then(values => {
		values.client.close()
		const jobs = values.result.map(record => {
			return spider(record.name, record.season)
				.then(fetched => {
					const newEposids = fetched.epsoids.filter(e => record.epsoids.find(re => re.fileName === e.fileName) === 0)
					const updatedRecrod = {
						original: record,
						newEposids
					}
					console.log(updatedRecrod)
					return Promise.resolve(fetched.epsoids.length == record.epsoids.length ? updatedRecrod : null)
				})
		})
		return Promise.all(jobs).then(records => {
			return Promise.resolve(records.filter(a => a !== null))			
		})
	})
}

const addListener = (mail, name, season) => {
	const updateListener = listener.read({mail}).then(values => {
		values.client.close()
		const result = values.result[0]
		if (result) {
			const listened = result.listenTo.filter(l => l.name == name && l.season == season).length > 0
			if (listened) throw new Error('Already added to the listen list, no need to add again')
			return listener.update({mail, listenTo: result.listenTo.slice().push({name, season})})
		} else {
			return listener.insert({mail, listenTo: [{name, season}]})
		}
	}).then(values => {
		values.client.close()
	})

	const updateSeries = series.read({name, season}).then(values => {
		values.client.close()
		const result = values.result[0]
		if (result) {
			return Promise.resolve(result.epsoids)
		} else {
			return spider(name, season)
				.then(obj => series.insert(obj))
				.then(values => {
					values.client.close()
					return Promise.resolve(values.result.epsoids)
				})
		}
	}).then(seedlist => {
		// send email
		return mailer(name, seedlist, mail)
	})

	return Promise.all([updateListener, updateSeries])
}

const dailyCheck = () => {

}

const index = async () => {
	const result = await addListener('guqiang180@gmail.com', 'Agents of S H I E L D', 6)
	console.log(result)
}

index().catch(console.error)
