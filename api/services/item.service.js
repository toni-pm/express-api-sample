const ItemModel = require('../models/item.model')

const findAll = async () => {
  const items = await ItemModel.find().select('-__v')
  return items
}

const findByName = async name => {
  const item = await ItemModel.findOne({ name }).select('-__v')
  return item
}

const create = async ({ name, description }) => {
  let item = await ItemModel.create({
    name,
    description
  })
  item = item.toJSON()
  delete item.__v
  return item
}

const deleteByName = async name => {
  const item = await ItemModel.findOneAndDelete({ name }).select('-__v')
  return item
}

module.exports = {
  findAll,
  findByName,
  create,
  deleteByName
}
