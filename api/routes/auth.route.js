const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { validate, validateUser } = require('../utils/validations')

router.post('/login',
  validate(validateUser()),
  authController.login)

module.exports = router
