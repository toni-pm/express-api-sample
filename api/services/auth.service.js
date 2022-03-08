const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')
const { JWT_SECRET } = require('../config/config.js')
const { findById } = require('../services/user.service')

const login = async (nickname, password) => {
  const user = await UserModel.findOne({ nickname }).select('-__v')
  if (!user) {
    return null
  }
  const matches = await user.matchPassword(password)
  return matches ? await user.generateToken() : null
}

const test = async () => {
  const user = new UserModel({
    nickname: 'testing',
    firstname: 'Test',
    lastname: 'User'
  })
  await user.setPassword('Testing1234567890!')
  await user.save()
  return await user.generateToken()
}

const verifyToken = async token => {
  const userDecoded = jwt.verify(token, JWT_SECRET)
  return await findById(userDecoded.user_id)
}

module.exports = {
  login,
  verifyToken,
  test
}
