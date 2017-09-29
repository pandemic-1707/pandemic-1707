<<<<<<< HEAD
var functions = require('firebase-functions')
const allCities = require('../data/all-cities.js')
const allEvents = require('../data/all-events.js')
const playerDeckUtils = require('./utils/playerDeck')

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https().onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })
=======
// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const infectionDeck = require('./data/infectionDeck')
// const { shuffle } = require('./utils/deckUtils')

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
    const shuffled = shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })
>>>>>>> master
