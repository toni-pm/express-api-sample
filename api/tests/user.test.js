const moongose = require('mongoose')
const { server } = require('..')
const { API } = require('../config/config.js')
const User = require('../models/user.model')
const { api, testToken, initialUsers, getAllUsers } = require('./helpers')

let authToken = ''

beforeAll(async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    const newUser = new User(user)
    await newUser.setPassword(user.password)
    await newUser.save()
  }
  authToken = await testToken()
})

describe('User find', () => {
  test('Find all', async () => {
    const response = await api
      .get(`${API}users`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(response.body).toHaveLength(initialUsers.length)
  })
  test('Find by nickname', async () => {
    const nickname = initialUsers[0].nickname
    const response = await api
      .get(`${API}users/${nickname}`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(response.body.nickname).toBe(nickname)
  })
  test('Find by nickname not found', async () => {
    const nickname = 'notfound'
    await api
      .get(`${API}users/${nickname}`)
      .expect(404)
  })
})

describe('User creation', () => {
  test('Unauthorized', async () => {
    const user = {
      nickname: 'john-doe',
      password: 'Testing1234567890123!',
      firstname: 'John',
      lastname: 'Doe'
    }
    await api
      .post(`${API}users`)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(401)
  })
  test('Success', async () => {
    const user = {
      nickname: 'johndoe',
      password: 'Testing1234567890123!',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(201)
    expect(response.body.nickname).toBe(user.nickname)

    const { contents, body } = await getAllUsers()
    expect(body).toHaveLength(initialUsers.length + 1)
    expect(contents).toContain(user.nickname)
  })
  test('Failed. User already exists.', async () => {
    const user = initialUsers[0]
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response.body.message).toBe('User already exists.')
  })
  test('Failed. Nickname must be at least 4 characters.', async () => {
    const user = {
      nickname: 'joh',
      password: 'Testing1234567890123!',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('nickname')
  })
  test('Failed. Nickname must have a maximum of 16 characters.', async () => {
    const user = {
      nickname: 'johnsupertestingdoe123456',
      password: 'Testing1234567890123!',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('nickname')
  })
  test('Failed. Nickname cannot contain special characters except - or _', async () => {
    const user = {
      nickname: 'johndoe!',
      password: 'Testing1234567890123!',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('nickname')
  })
  test('Failed. Password is not strong. Minimum length 16.', async () => {
    const user = {
      nickname: 'johndoe',
      password: '#Testing!123',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
  test('Failed. Password is not strong. 1 lowercase letter is missing.', async () => {
    const user = {
      nickname: 'johndoe',
      password: '$$TESTING!335847323TOKASD!)$$',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
  test('Failed. Password is not strong. 1 uppercase letter is missing.', async () => {
    const user = {
      nickname: 'johndoe',
      password: '$$testing!335847323!)$$',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
  test('Failed. Password is not strong. 1 number is missing.', async () => {
    const user = {
      nickname: 'johndoe',
      password: '$$Testingtesting!TOKASD!)$$',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
  test('Failed. Password is not strong. 1 number is missing.', async () => {
    const user = {
      nickname: 'johndoe',
      password: '$$Testingtesting!TOKASD!)$$',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
  test('Failed. Password is not strong. 1 symbol is missing.', async () => {
    const user = {
      nickname: 'johndoe',
      password: 'TestingtestingTOKASD32555',
      firstname: 'John',
      lastname: 'Doe'
    }
    const response = await api
      .post(`${API}users`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('password')
  })
})

describe('User delete', () => {
  test('Unauthorized', async () => {
    const nickname = initialUsers[1].nickname
    await api
      .delete(`${API}users/${nickname}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(401)
  })
  test('Success', async () => {
    const nickname = initialUsers[1].nickname
    await api
      .delete(`${API}users/${nickname}`)
      .set('Authorization', authToken)
      .expect(204)
  })
})

afterAll(() => {
  moongose.connection.close()
  server.close()
})
