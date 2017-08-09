const Todolists  = require('../models/todolists')
const Users  = require('../models/users')

async function get (req, res, next) {
  const data = await Todolists.find()
  res.status(200).json({success:true,data:data})
}

async function post (req, res, next) {
     let newTask = new Todolists({
    text:req.body.text,
    _user:req.user
  })
  const data = await newTask.save()
  res.status(200).json({success:true,data:data})
}

async function remove (req, res, next) {
  const valid_data = await Todolists.findOne({_id:req.params.id})
  if(!valid_data && valid_data._user.id === req.user.id ){
  res.status(404).json({success:false,msg:'task not found'})
  }else{
  const data = await Todolists.findByIdAndRemove(req.params.id)
  res.status(200).json({success:true,msg:'remove success'})
  }

}

module.exports = {
  get:get,
  post:post,
  remove:remove
}
