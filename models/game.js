/**
 * librerias
 */
const mongoose = require('mongoose')
const Game = require('../schema/gameSchema')
/**
 *
 * @version [1.0.000, 2022-03-03]
 *
 * @author [Juan Esteban, Velasquez Posada ]
 *
 * @since [1.0.000 2022-03-03]
 *
 */
function create (game) {
  game.gamers = game.gamers.map((gamer) => {
    return {
      name: gamer
    }
  })
  const newGame = new Game(game)
  return newGame.save()
}

async function getById (id) {
  const infoReturn = {}
  const data = await Game.findById(id)
  const gamers = data.gamers.sort((a, b) => b.score - a.score)
  infoReturn.id = data._id
  infoReturn.gamers = data.gamers.map(gamer => {
    const gamerToReturn = {}
    gamerToReturn[`${gamer._id}`] = {
      id: gamer._id,
      name: gamer.name
    }
    return gamerToReturn
  })
  infoReturn.inProgress = data.inProgress
  const numberRandom = parseInt(Math.random() * (4 - 1) + 1)
  infoReturn.winner = {
    id: gamers[0].id,
    name: gamers[0].name
  }
  return infoReturn
}

function startGame (id, gamerBet) {
  const gamerBets = []
  const playersId = Object.keys(gamerBet)
  playersId.map((playerId) => {
    gamerBets.push({
      _id: mongoose.Types.ObjectId(playerId),
      score: gamerBet[playerId]
    })
    return playerId
  })
  return Game.findByIdAndUpdate(id, { gamers: gamerBets })
}

async function getWinner (id, name) {
  const data = await Game.findById(id)
  const gamers = data.gamers.sort((a, b) => b.score - a.score)
  const infoReturn = {
    id: gamers[0].id,
    name: gamers[0].name
  }
  return infoReturn
}

/**
 * exportacion de funciones
 */
module.exports = {
  create,
  getById,
  getWinner,
  startGame
}
