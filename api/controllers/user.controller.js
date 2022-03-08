const { ErrorHandler } = require('../config/error')
const userService = require('../services/user.service')

const findAll = async (req, res, next) => {
  try {
    const items = await userService.findAll()
    return res.send(items)
  } catch (err) {
    return next(new ErrorHandler(500, 'Error finding users.', err))
  }
}

const findByNickname = async (req, res, next) => {
  try {
    const { nickname } = req.params
    const item = await userService.findByNickname(nickname)
    if (item) {
      return res.send(item)
    } else {
      return res.sendStatus(404)
    }
  } catch (err) {
    return next(new ErrorHandler(500, 'Error finding user.', err))
  }
}

const create = async (req, res, next) => {
  try {
    const { nickname, firstname, lastname, password } = req.body
    const item = await userService.create({ nickname, firstname, lastname, password })
    return res.status(201).send(item)
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new ErrorHandler(400, 'User already exists.'))
    }
    return next(new ErrorHandler(500, 'Error trying to create user.', err))
  }
}

const deleteByNickname = async (req, res, next) => {
  try {
    const { nickname } = req.params
    await userService.deleteByNickname(nickname)
    return res.sendStatus(204)
  } catch (err) {
    return next(new ErrorHandler(500, 'Error trying to delete user.', err))
  }
}

module.exports = {
  findAll,
  findByNickname,
  create,
  deleteByNickname
}
