const Users  = require('../models/users')
const Bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

async function create (req, res, next) {

  let newUser = new Users({
    name:req.body.name,
    username:req.body.username,
    hashpassword:Bcrypt.hashSync(req.body.password,10)
  });

  const data = await newUser.save();
  data.hashpassword = null
  res.status(200).json(data)

}

async function login(req, res, next) {
    const user = await Users.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({ message: 'User not found' });
    } else {
        if (!user.comparePassword(req.body.password)) {
            res.status(401).json({ message: 'wrong password' });
        } else {
            return res.json({ token: Jwt.sign({ username: user.username, _id: user._id }, 'crudtest') });
        }
    }
}

async function loginRequired(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
}

async function getall(req,res,next){
    const data = await Users.find();
    res.status(200).json(data)
}

module.exports={
    create:create,
    getall:getall,
    login:login,
    loginRequired:loginRequired
}