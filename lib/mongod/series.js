const mongod = require('./mongod')

const beforeOperate = () => mongod.beforeOperate('series')

const read = (filter = {}) => beforeOperate()
	.then(values => mongod.retriveDocuments(values.client, values.collection, filter))

const update = (input) => beforeOperate()
	.then(values => mongod.updateDocuments(values.client, values.collection, {name: input.name}, input))

const insert = (input) => beforeOperate()
	.then(values => mongod.createDocuments(values.client, values.collection, input))

module.exports = {
	read,
	update,
	insert
}