// librerias

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * modelo de usuario
 */

const gamersSchema = new Schema({
  score: Number,
  name: {
    type: String,
    trim: true,
    require: true
  }
})

/**
 * modelo de juego
 */

const gameSchema = new Schema({
  inProgress: {
    type: Boolean,
    default: false
  },
  type: {
    type: String
  },
  gamers: [gamersSchema],
  score: Number
})

module.exports = game = mongoose.model('Game', gameSchema)
