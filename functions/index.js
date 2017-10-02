// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const infectionDeck = require('./data/infectionDeck')
const cities = require('./data/cities')
const events = require('./data/events')
// const { shuffle } = require('./utils/deckUtils')
const utils = require('pandemic-1707-utils')
const deckUtils = utils.deckUtils
const playerDeckUtils = utils.playerDeckUtils
const playerUtils = utils.playerUtils

function shuffle(array) {
  let temp = null

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

const NUM_PLAYERS_4 = 4
const NUM_EPIDEMICS = 4

exports.initializeDecks = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    const shuffled = deckUtils.shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })

exports.initializePlayerDecks = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const numPlayers = event.data.ref.child('playerNumber').val()
    const playerDeckHands = playerDeckUtils.initPlayerDeck(numPlayers, NUM_EPIDEMICS)
    const playerDeck = playerDeckHands.playerDeck
    const playerHands = playerDeckHands.playerHands
    for (let i = 1; i <= numPlayers; i++) {
      event.data.ref.child(`players/player${i}`).child('hand').set(playerHands[i-1])
    }
    return event.data.ref.child('playerDeck').set(playerDeckHands.playerDeck)
  })
