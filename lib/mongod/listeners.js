const mongod = require('./mongod')

const beforeOperate = () => mongod.beforeOperate('listeners')

const read = () => beforeOperate()
	.then(values => mongod.retriveDocuments(values.client, values.collection))

const update = (input) => beforeOperate()
	.then(values => mongod.updateDocuments(values.client, values.collection, {mail: input.mail}, input))

const insert = (input) => beforeOperate()
	.then(values => mongod.createDocuments(values.client, values.collection, input))

module.exports = {
	read,
	update,
	insert
}