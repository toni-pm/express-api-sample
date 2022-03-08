const moongose = require('mongoose')
const { server } = require('..')
const { API } = require('../config/config.js')
const Item = require('../models/item.model')
const { api, testToken, initialItems, getAllItems } = require('./helpers')

let authToken = ''

beforeAll(async () => {
  authToken = await testToken()
})

beforeEach(async () => {
  await Item.deleteMany({})

  for (const item of initialItems) {
    const newItem = new Item(item)
    await newItem.save()
  }
})

describe('Item creation', () => {
  test('Unauthorized', async () => {
    const item = {
      name: 'Logitech M185',
      description: 'Logitech M185 Ratón Inalámbrico 1000DPI Gris'
    }
    await api
      .post(`${API}items`)
      .set('Accept', 'application/json')
      .send(item)
      .expect('Content-Type', /application\/json/)
      .expect(401)
  })
  test('Success', async () => {
    const item = {
      name: 'Logitech M185',
      description: 'Logitech M185 Ratón Inalámbrico 1000DPI Gris'
    }
    const response = await api
      .post(`${API}items`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(item)
      .expect('Content-Type', /application\/json/)
      .expect(201)
    expect(response.body.name).toBe(item.name)

    const { contents, body } = await getAllItems()
    expect(body).toHaveLength(initialItems.length + 1)
    expect(contents).toContain(item.name)
  })
  test('Failed. Name required field.', async () => {
    const item = {
      description: 'Logitech M185 Ratón Inalámbrico 1000DPI Gris'
    }
    const response = await api
      .post(`${API}items`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(item)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response).toBeValidationError('name')
  })
  test('Failed. Item already exists.', async () => {
    const response = await api
      .post(`${API}items`)
      .set('Authorization', authToken)
      .set('Accept', 'application/json')
      .send(initialItems[0])
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(response.body.message).toBe('Item already exists.')
  })
})

describe('Item find', () => {
  test('Find all', async () => {
    const response = await api
      .get(`${API}items`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(response.body).toHaveLength(initialItems.length)
  })
  test('Find by name', async () => {
    const name = initialItems[0].name
    const response = await api
      .get(`${API}items/${name}`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(response.body.name).toBe(name)
  })
  test('Find by name not found', async () => {
    const name = 'notfound'
    await api
      .get(`${API}items/${name}`)
      .expect(404)
  })
})

describe('Item delete', () => {
  test('Unauthorized', async () => {
    const name = initialItems[0].name
    await api
      .delete(`${API}items/${name}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(401)
  })
  test('Success', async () => {
    const name = initialItems[0].name
    await api
      .delete(`${API}items/${name}`)
      .set('Authorization', authToken)
      .expect(204)

    const { contents, body } = await getAllItems()
    expect(body).toHaveLength(initialItems.length - 1)
    expect(contents).not.toContain(name)
  })
})

afterAll(() => {
  moongose.connection.close()
  server.close()
})
