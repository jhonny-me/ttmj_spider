const mailer = require('../lib/mail/mailer')
const series = require('../lib/mongod/series')
const listener = require('../lib/mongod/listeners')
const spider = require('../lib/ttmj_spider')

const seriesUpdateCheck = () => {
	return series.read().then(values => {
		values.client.close()
		const jobs = values.result.map(record => 
			spider(record.name, record.season)
				.then(fetched => {
					const newEposids = fetched.epsoids.filter(e => record.epsoids.find(re => re.fileName === e.fileName) === 0)
					const updatedRecrod = {
						original: record,
						newEposids
					}
					if (newEposids.length > 0) {
						return series.update(fetched)
							.then(values => {
								values.client.close()
								return Promise.resolve(updatedRecrod)
							})
					}
					
					return Promise.resolve(null)
				})
		)
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
			const newArr = result.listenTo.slice(0)
			newArr.push({name, season})
			return listener.update({mail, listenTo: newArr})
		} else {
			console.log(mail)
			return listener.insert({mail, listenTo: [{name, season}]})
		}
	}).then(values => {
		values.client.close()
		return series.read({name, season})
	}).then(values => {
		values.client.close()
		const result = values.result[0]
		if (result) {
			return Promise.resolve([{
				original: result,
				newEpsoids: result.epsoids
			}])
		} else {
			return spider(name, season)
				.then(obj => series.insert(obj))
				.then(values => {
					values.client.close()
					const series = values.result.ops[0]
					return Promise.resolve([{
						original: series,
						newEpsoids: series.epsoids,
					}])
				})
		}
	}).then(seedlist => {
		// send email
		return mailer(seedlist, mail)
	})

	return updateListener
}

module.exports = {
	seriesUpdateCheck,
	addListener
}