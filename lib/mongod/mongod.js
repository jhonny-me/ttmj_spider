const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://216.24.186.181:27017'

const dbName = 'ttmj_spider'

const connect = () => new Promise((re, rj) => {
	MongoClient.connect(url, (err, client) => {
		if (err) { return rj(err) }
		re(client)
	})
})

const createDocuments = (client, collection, json) => new Promise((re, rj) => {
	collection.insertOne(json, (err, result) => {
		if (err) { client.close(); return rj(err) }
		re({client, result})
	})
})

const updateDocuments = (client, collection, filter = {}, update) => new Promise((re, rj) => {
	collection.updateOne(filter, { $set: update }, (err, result) => {
		if (err) { client.close(); return rj(err) }
		re({client, result})
	})
})

const retriveDocuments = (client, collection, filter = {}) => new Promise((re, rj) => {
	collection.find(filter).toArray((err, result) => {
		if (err) { client.close(); return rj(err) }
		re({client, result})
	})
})

const deleteDocuments = (collection, filter) => new Promise((re, rj) => {
	collection.deleteOne(filter, (err, result) => {
		if (err) { client.close(); return rj(err) }
		re({client, result})
	})
})

const beforeOperate = (docName) => connect()
	.then(client => {
		const db = client.db(dbName)
		const collection = db.collection(docName)
		return new Promise((re, rj) => re({client, db, collection}))
	})

module.exports = {
	beforeOperate,
	createDocuments,
	updateDocuments,
	retriveDocuments,
	deleteDocuments
}