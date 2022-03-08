const User = require('../models/user.model')
const UserModel = require('../models/user.model')

const findById = async userId => {
  return await User.findById(userId)
}

const findAll = async () => {
  const items = await UserModel.find().select('-hash -salt -__v')
  return items
}

const findByNickname = async nickname => {
  const item = await UserModel.findOne({ nickname }).select('-hash -salt -__v')
  return item
}

const create = async ({ nickname, firstname, lastname, password }) => {
  const user = new UserModel({
    nickname,
    lastname,
    firstname
  })
  await user.setPassword(password)
  await user.save()
  return user.format()
}

const deleteByNickname = async nickname => {
  const item = await UserModel.findOneAndDelete({ nickname }).select('-hash -salt -__v')
  return item
}

module.exports = {
  findById,
  findAll,
  findByNickname,
  create,
  deleteByNickname
}
