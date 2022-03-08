const log4js = require('log4js')
const config = require('../config/config.js')
const logger = log4js.getLogger()
logger.level = config.NODE_ENV === 'test' ? '' : 'debug'

module.exports = logger
