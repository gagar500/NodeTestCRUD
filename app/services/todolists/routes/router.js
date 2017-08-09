const express = require('express')
const router = express.Router()

const todolistsController = require('../controllers/todolists.js')
const usersController = require('../controllers/user')

router.route('/')
  .get(todolistsController.get)
  .post(usersController.loginRequired,todolistsController.post)

router.route('/:id')
  .delete(usersController.loginRequired,todolistsController.remove)
  .put(usersController.loginRequired,todolistsController.update)

  router.route('/user/create')
  .post(usersController.create)

  router.route('/user/getall')
  .get(usersController.getall)

  router.route('/user/login')
  .post(usersController.login)

module.exports = router
