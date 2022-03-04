// librerias
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * modelo de jugador
 */
const playersSchema = new Schema({
  score: Number,
  name: {
    type: String,
    trim: true,
    require: true
  }
})

module.exports = Player = mongoose.model('Player', playersSchema)
