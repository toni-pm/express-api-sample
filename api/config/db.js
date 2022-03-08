const mongoose = require('mongoose')
const { ServerApiVersion } = require('mongodb')
const config = require('./config.js')

let db = null
let mongoServer = null

const connect = async () => {
  if (config.NODE_ENV === 'test') {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    mongoServer = await MongoMemoryServer.create()
  }

  const mongoUri = (config.NODE_ENV === 'test')
    ? mongoServer.getUri()
    : `mongodb+srv://${config.DATABASE_USERNAME}:${config.DATABASE_PASSWORD}@${config.DATABASE_HOST}/${config.DATABASE_NAME}?retryWrites=true&w=majority`

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
  const mongoDb = mongoose.connection
  mongoDb.on('error', console.error.bind(console, 'MongoDB connection error:'))

  return mongoDb
}

const getConnection = async () => {
  if (!db) {
    db = await connect()
  }
  return db
}

const close = async () => {
  if (db) {
    if (config.NODE_ENV === 'test') {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      await mongoServer.stop()
    } else {
      await mongoose.connection.close()
    }
  }
}

const clear = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany()
  }
}

module.exports = { getConnection, close, clear }
