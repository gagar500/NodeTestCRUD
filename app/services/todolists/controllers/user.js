const Users  = require('../models/users')
const Bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

async function create (req, res, next) {
  const user = await Users.findOne({ username: req.body.username })
 if(user){
      res.status(401).json({success:false, msg: 'User is exists' });
 }else{
  let newUser = new Users({
    name:req.body.name,
    username:req.body.username,
    hashpassword:Bcrypt.hashSync(req.body.password,10)
  });

  const data = await newUser.save();
  data.hashpassword = null
  res.status(200).json({success:true,data:data})
 }
}

async function login(req, res, next) {
    const user = await Users.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({success:false, msg: 'User not found' });
    } else {
        if (!user.comparePassword(req.body.password)) {
            res.status(401).json({success:false, msg: 'wrong password' });
        } else {
            return res.json({ success:true,token: Jwt.sign({ username: user.username, _id: user._id }, 'crudtest') });
        }
    }
}

async function loginRequired(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({  success:false,msg: 'Unauthorized user' });
  }
}

async function getall(req,res,next){
    let data = await Users.find().populate('_todoLists')
    
    data = data.map((x)=>{
        x.hashpassword = null
        return x
    })
    res.status(200).json(data)
}

module.exports={
    create:create,
    getall:getall,
    login:login,
    loginRequired:loginRequired
}