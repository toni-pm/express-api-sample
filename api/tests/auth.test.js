const moongose = require('mongoose')
const { server } = require('../')
const { API } = require('../config/config.js')
const User = require('../models/user.model')
const { api, initialUsers } = require('./helpers')

beforeAll(async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    const newUser = new User(user)
    await newUser.setPassword(user.password)
    await newUser.save()
  }
})

describe('Login', () => {
  test('Success with access token', async () => {
    const user = initialUsers[0]

    const response = await api
      .post(`${API}auth/login`)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(200)

    expect(response.body.token).toBeDefined()
    expect(response.body.token.startsWith('Bearer ')).toBe(true)
  })
  test('Invalid credentials', async () => {
    const user = {
      nickname: initialUsers[0].nickname,
      password: 'OtherPassword1234567890123!'
    }

    await api
      .post(`${API}auth/login`)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(403)
  })
  test('Failed. Nickname must be at least 4 characters.', async () => {
    const user = {
      nickname: 'ton',
      password: 'Testing1234567890123!'
    }

    const response = await api
      .post(`${API}auth/login`)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('nickname')
  })
  test('Failed. Password validation fails', async () => {
    const user = {
      nickname: 'tonipm',
      password: 'Testing'
    }

    const response = await api
      .post(`${API}auth/login`)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
})

afterAll(() => {
  moongose.connection.close()
  server.close()
})
