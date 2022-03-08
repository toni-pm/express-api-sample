const mongoose = require('mongoose')

module.exports = mongoose.model('ItemModel', new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String
}))
