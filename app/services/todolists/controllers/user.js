const Users  = require('../models/users')

async function post (req, res, next) {

  let newUser = new Users({
    name:req.body.name
  });

  const data = await newUser.save();
  res.status(200).json(data)

}

module.exports={
    post:post
}