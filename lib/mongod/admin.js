const mongod = require('./mongod')

const name = 'admin'

const beforeOperate = () => mongod.beforeOperate('admin')

const read = () => beforeOperate()
	.then(values => mongod.retriveDocuments(values.client, values.collection))
	.then(values => {
		values.client.close()
		return Promise.resolve(values.result[0])
	})

const update = (input) => beforeOperate()
	.then(values => mongod.updateDocuments(values.client, values.collection, { name }, {...input, name}))

const init = (input) => beforeOperate()
	.then(values => {
		
		return mongod.createDocuments(values.client, values.collection, {...input, name})	
	})

module.exports = {
	read,
	update,
	init
}