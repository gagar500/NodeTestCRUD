const Todolists = require('../models/todolists')
const Users = require('../models/users')

async function get(req, res, next) {
  const data = await Todolists.find()
  res.status(200).json(data)
}

async function post(req, res, next) {
  let newTask = new Todolists({
    text: req.body.text,
    _user: req.user
  })
  const data = await newTask.save()
  res.status(200).json({
    success: true,
    data: data
  })
}

async function remove(req, res, next) {
  const valid_data = await Todolists.findOne({
    _id: req.params.id
  })
  
  if (valid_data && valid_data._user == req.user._id) {
    const data = await Todolists.findByIdAndRemove(req.params.id)
    res.status(200).json({
      success: true,
      msg: 'remove success'
    })
  } else {
    res.status(404).json({
      success: false,
      msg: 'task not found'
    })
  }

}

async function update(req, res, next) {
  const valid_data = await Todolists.findOne({
    _id: req.params.id
  })
  
  if (valid_data && valid_data._user == req.user._id) {

    let updateTask ={
      text:req.body.text
    }
    const data = await Todolists.findByIdAndUpdate(req.params.id,updateTask)
    data.text=updateTask.text
    res.status(200).json({
      success: true,
      msg: 'update success',
      data:data
    })
  } else {
    res.status(404).json({
      success: false,
      msg: 'task not found'
    })
  }

}

module.exports = {
  get: get,
  post: post,
  remove: remove,
  update:update
}