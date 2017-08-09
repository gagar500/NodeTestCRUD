const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Todolist = new Schema({
	text: { type: String, required: true },
	_user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	}
})

module.exports = Mongoose.model('Todolist', Todolist)
