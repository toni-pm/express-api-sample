const { app } = require('../')
const { API } = require('../config/config.js')
const request = require('supertest')
const User = require('../models/user.model')
const api = request(app)

let authToken = ''

const initialUsers = [
  {
    nickname: 'testing',
    firstname: 'Test',
    lastname: 'User',
    password: 'q9^KH6tXp%JUqEq*'
  },
  {
    nickname: 'tonipm',
    firstname: 'Toni',
    lastname: 'Peraira',
    password: 'j%Q6bep44Vxrth6Z'
  }
]

const testToken = async () => {
  if (!authToken) {
    const user = initialUsers[0]
    let testUser = await User.findOne({ nickname: user.nickname })
    if (!testUser) {
      testUser = new User(user)
      await testUser.setPassword(user.password)
      await testUser.save()
    }
    authToken = await testUser.generateToken()
  }
  return authToken
}

const initialItems = [
  {
    name: 'MSI Optix G271',
    description: 'MSI Optix G271 27" LED IPS FullHD 144Hz FreeSync'
  },
  {
    name: 'AOC C24G2U',
    description: 'AOC C24G2U/BK 23.6" LED FullHD 165Hz FreeSync Premium Curva'
  },
  {
    name: 'Acer KG251Q',
    description: 'Acer KG251QJbmidpx 24.5" LED FullHD 165Hz FreeSync'
  }
]

const getAllUsers = async () => {
  const response = await api.get(`${API}users`)
  return {
    contents: response.body.map(item => item.nickname),
    body: response.body
  }
}

const getAllItems = async () => {
  const response = await api.get(`${API}items`)
  return {
    contents: response.body.map(item => item.name),
    body: response.body
  }
}

module.exports = {
  api,
  testToken,
  initialUsers,
  initialItems,
  getAllUsers,
  getAllItems
}
