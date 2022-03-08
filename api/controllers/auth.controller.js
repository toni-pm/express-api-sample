const { ErrorHandler } = require('../config/error')
const authService = require('../services/auth.service')

const login = async (req, res, next) => {
  try {
    const { nickname, password } = req.body
    const token = await authService.login(nickname, password)
    if (token) {
      return res.send({ token: `Bearer ${token}` })
    }
    return res.status(403).send({ message: 'Invalid credentials' })
  } catch (err) {
    return next(new ErrorHandler(500, 'Login error.', err))
  }
}
const test = async (req, res, next) => {
  try {
    const token = await authService.test()
    return res.send({ token: `Bearer ${token}` })
  } catch (err) {
    return next(new ErrorHandler(500, 'Auth test error.', err))
  }
}

module.exports = {
  login,
  test
}
