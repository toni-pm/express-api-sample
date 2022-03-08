const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')
const { validate, validateUser } = require('../utils/validations')

router.get('/', userController.findAll)

router.get('/:nickname', userController.findByNickname)

router.post('/',
  // authMiddleware,
  validate(validateUser()),
  userController.create)

router.delete('/:nickname', authMiddleware, userController.deleteByNickname)

module.exports = router
