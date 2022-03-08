const { ErrorHandler } = require('../config/error')
const itemService = require('../services/item.service')

const findAll = async (req, res, next) => {
  try {
    const items = await itemService.findAll()
    return res.send(items)
  } catch (err) {
    return next(new ErrorHandler(500, 'Error finding items.', err))
  }
}

const findByName = async (req, res, next) => {
  try {
    const { name } = req.params
    const item = await itemService.findByName(name)
    if (item) {
      return res.send(item)
    } else {
      return res.sendStatus(404)
    }
  } catch (err) {
    return next(new ErrorHandler(500, 'Error finding item.', err))
  }
}

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const item = await itemService.create({ name, description })
    return res.status(201).send(item)
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new ErrorHandler(400, 'Item already exists.'))
    }
    return next(new ErrorHandler(500, 'Error trying to create item.', err))
  }
}

const deleteByName = async (req, res, next) => {
  try {
    const { name } = req.params
    await itemService.deleteByName(name)
    return res.sendStatus(204)
  } catch (err) {
    return next(new ErrorHandler(500, 'Error trying to delete item.', err))
  }
}

module.exports = {
  findAll,
  findByName,
  create,
  deleteByName
}
