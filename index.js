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
		const result = values.result
		if (result.length > 0) {
			const listened = result.listenTo.filter(l => l.name == name && l.season).length > 0
			if (listened) throw new Error('Already added to the listen list, no need to add again')
			return listener.update({mail, listenTo: result.listenTo.slice().push({name, season})})
		} else {
			return listener.update({mail, listenTo: [name]})
		}
	}).then(values => {
		values.client.close()
	})

	const updateSeries = series.read({name, season}).then(values => {
		values.client.close()
		const result = values.result
		if (result.length === 0) {
			return spider(name, season)
		} else {
			Promise.resolve(result.epsoids)
		}
	}).then(seedlist => {
		// insert to the db
		return series.update({
			name,
			season,
			epsoids: seedlist
		})
	}).then(values => {
		values.client.close()
		// send email
		return mailer(name, values.result.epsoids, mail)
	})

	return Promise.all([updateListener, updateSeries])
}

const dailyCheck = () => {

}

const index = async () => {
	const result = await seriesUpdateCheck()
	console.log(result)
}

index().catch(console.error)
