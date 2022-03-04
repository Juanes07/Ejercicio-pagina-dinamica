// librerias importadas

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const axios = require('axios').create({ baseUrl: 'https://localhost:8080/' })
const { body, validationResult } = require('express-validator')
const GameModel = require('./models/game')

// motor de plantillas
app.use(express.json())
app.use((express.static(path.join(__dirname, '/public'))))
// app.engine('html', engines.mustache)
// app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))

/**
 * conexion a base de datos
 */
const mongodb = 'mongodb://localhost/ejercicioformulario'
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

/**
 * peticiones a servidor
 */

app.get('/', async (req, res) => {
  try {
    const response = await axios({
      url: 'index',
      method: 'get'
    })
    res.status(200).json(response.data)
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

// para acceder a la pagina dinamica, se debe ingresar la direcion localhost:8080/getgame.html
app.get('/getgame', async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.json({ message: errors })
  } else {
    try {
      const response = await axios({
        url: 'getgame',
        method: 'get'
      })
      body('name', 'Empty name').trim().isLength({ min: 1 }).escape()
      res.status(200).json(response.data)
    } catch (err) {
      res.status(500).json({ message: err })
    }
  }
})

app.post('/creategame', async (req, res) => {
  try {
    const body = req.body
    const gameCreated = await GameModel.create(body)
    res.status(200).json(gameCreated)
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

app.get('/game/:id', async (req, res) => {
  try {
    const data = await GameModel.getById(req.params.id)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

app.get('/game/:id/winner', async (req, res) => {
  try {
    const bodyBet = req.body
    const win = await GameModel.getWinner(bodyBet.id, bodyBet.name)
    console.log(win)
    res.status(200).json(win)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

app.post('/startGame', async (req, res) => {
  try {
    const bodyBet = req.body
    const resultGame = await GameModel.startGame(bodyBet.id, bodyBet.gamerBet)
    res.status(200).json(resultGame)
    console.log(resultGame)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

app.listen(8080, () => {
  console.log('SERVER UP en http://localhost:8080')
})
