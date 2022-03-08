const router = require('express').Router()
const { API } = require('../config/config.js')

// API welcome message
router.get('/', async function (req, res) {
  return res.send({ message: 'Welcome to TPMComponents' })
})

module.exports = app => {
  app.use(API, router)
  app.use(`${API}auth`, require('./auth.route'))
  app.use(`${API}users`, require('./user.route'))
  app.use(`${API}items`, require('./item.route'))
}
