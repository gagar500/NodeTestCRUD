const Bcrypt = require('bcrypt')
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Users = new Schema({
    name: { type: String },
    username: { type: String, required: true },
    hashpassword: { type: String, required: true },
    _todoLists: [{
        type: Schema.Types.ObjectId,
        ref: 'TodoLists'
    }]
})

Users.methods.comparePassword=function(password){
 return Bcrypt.compareSync(password,this.hashpassword);     
}

module.exports = Mongoose.model('Users', Users)
