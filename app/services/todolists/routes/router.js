const express = require('express')
const router = express.Router()

const todolistsController = require('../controllers/todolists.js')
const usersController = require('../controllers/user')

router.route('/')
  .get(todolistsController.get)

  router.route('/')
  .post(todolistsController.post)

  router.route('/')
  .delete(todolistsController.remove)

  router.route('/create/user')
  .post(usersController.post)

module.exports = router
