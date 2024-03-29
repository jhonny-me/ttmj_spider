const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

const mon = JSON.parse(fs.readFileSync(__dirname + '/../../config.json', 'utf8')).mongod

const url = mon.url 

const dbName = 'ttmj_spider'

const connect = () => new Promise((re, rj) => {
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, (err, client) => {
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
	collection.findOneAndUpdate(filter, { $set: update }, (err, result) => {
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