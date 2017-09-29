// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const infectionDeck = require('./data/infectionDeck')
// const { shuffle } = require('./utils/deckUtils')
const utils = require('./utils/deckUtils')
const playerDeckUtils = require('./utils/playerDeck-utils.js')
const playerUtils = require('./utils/player-utils.js')

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

exports.initializeDecks = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    const shuffled = utils.shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })
