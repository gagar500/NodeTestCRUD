const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Users = new Schema({
    name: {type: String},
    _todoLists:[{ type: Schema.Types.ObjectId, 
        ref: 'TodoLists' }]
})

module.exports = Mongoose.model('Users', Users)
