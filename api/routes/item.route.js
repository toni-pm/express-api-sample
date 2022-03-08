const router = require('express').Router()
const authMiddleware = require('../middleware/auth.middleware')
const itemController = require('../controllers/item.controller')
const { validate, validateItem } = require('../utils/validations')

router.get('/', itemController.findAll)

router.get('/:name', itemController.findByName)

router.post('/', authMiddleware,
  validate(validateItem()),
  itemController.create)

router.delete('/:name', authMiddleware, itemController.deleteByName)

module.exports = router
