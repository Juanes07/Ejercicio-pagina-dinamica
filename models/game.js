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

/**
 * Funcion crear Juego
 * @param  game datos agregados por formulario
 * @returns juego guardado en mongodb
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
/**
 * funcion para obtener Id de la partida (automatico por mongodb)
 * @param id numero de id de cada partida
 * @returns gamerToReturn informacion de la partida creada. infoReturn informacion sobre el ganador
 */
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
  infoReturn.winner = {
    id: gamers[0].id,
    name: gamers[0].name
  }
  return infoReturn
}

/**
 * funcion comenzar juego
 * @param  id numero id de la partida creada
 * @param  gamerBet arreglo donde se agregan los jugadores/score
 * @returns un arreglo con los id de los jugadores con su score agregado
 */

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

/**
 * funcion para traer al ganador de la partida
 * @param id numero id de la partida creada
 * @returns infoReturn id de cada jugador con su nombre
 */

async function getWinner (id) {
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
