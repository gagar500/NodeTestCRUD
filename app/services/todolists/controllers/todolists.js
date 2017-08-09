const Todolists  = require('../models/todolists')
const Users  = require('../models/users')

async function get (req, res, next) {
  const data = await Todolists.find()
  res.status(200).json(data)
}

async function post (req, res, next) {
  const user = await Users.findOne()
  if(!user)
    {
       res.status(404).json({success:false,msg:'No user'})
    }else{
  let newTask = new Todolists({
    text:req.body.text,
    _user:user
  });
  const data = await newTask.save();
  res.status(200).json(data)
    }

}

async function remove (req, res, next) {
  const data = await Todolists.findByIdAndRemove(req.body.id)
  res.status(200).json(data)
}

module.exports = {
  get:get,
  post:post,
  remove:remove
}
