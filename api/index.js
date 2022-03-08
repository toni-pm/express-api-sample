const express = require('express')
const morgan = require('morgan')
const { handleError, ErrorHandler } = require('./config/error')
const config = require('./config/config.js')
const { getConnection, close } = require('./config/db')
const logger = require('./log/logger.log')

const app = express()

app.use(express.json({ limit: '5mb' }))

if (config.NODE_ENV === 'development') {
  app.use(morgan('tiny')) // Log HTTP requests
}

// Routes
require('./routes')(app)

// 404 Not found error
app.use((req, res, next) => {
  handleError(new ErrorHandler(404, `${req.originalUrl} not found`), req, res)
})

// Error handling
process.on('uncaughtException', err => {
  logger.fatal('----- Uncaught exception -----')
  logger.fatal(err)
  logger.fatal('----------------------------------')
})

process.on('unhandledRejection', err => {
  logger.fatal('----- Unhandled Rejection -----')
  logger.fatal(err)
  logger.fatal('----------------------------------')
})

app.use((err, req, res, next) => {
  handleError(err, req, res)
})

// Port Listening & Initialize db connection.
const server = app.listen(config.PORT, async function () {
  await getConnection()
  logger.info(`Server listening on port ${config.PORT}!`)
})

// Close connection on exit.
process.on('SIGINT', function () {
  close().then(() => {
    server.close(function () {
      logger.info('Closed connection!')
      process.exit(0)
    })
  })
})

module.exports = {
  app,
  server
}
