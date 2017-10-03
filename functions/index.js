// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const cities = require('./data/cities')
const infectionDeck = require('./data/infectionDeck')
const events = require('./data/events')
// const { shuffle } = require('./utils/deckUtils')
const utils = require('pandemic-1707-utils')
const deckUtils = utils.deckUtils
const playerDeckUtils = utils.playerDeckUtils
const playerUtils = utils.playerUtils

// function shuffle(array) {
//   let temp = null

//   for (let i = array.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1))
//     temp = array[i]
//     array[i] = array[j]
//     array[j] = temp
//   }

//   return array
// }

const NUM_PLAYERS_4 = 4
const NUM_EPIDEMICS = 4

// shuffle the infection deck and add it to the room
exports.initializeInfectionDeck = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    const shuffled = deckUtils.shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })

// updated to initialize player locations at the same time
// exports.initializePlayerInfo = functions.database.ref('/rooms/{name}')
//   .onCreate(event => {
//     const numPlayers = event.data.val().numPlayers
//     const players = event.data.val().players
//     console.log('players', players)
//     const playersKeyArr = Object.keys(players)
//     console.log('playersKeyArr', playersKeyArr)
//     const cdcLocation = {city: 'Atlanta', location: [33.748995, -84.387982]}
//     const updatedData = {}
//     // initPlayerDeck returns { playerDeck: shuffled deck with epidemics,
//     // playerHands: array of arrays (each array is initial player starting hand) }
//     const playerDeckHands = playerDeckUtils.initPlayerDeck(numPlayers, NUM_EPIDEMICS)
//     const playerDeck = playerDeckHands.playerDeck
//     const playerHands = playerDeckHands.playerHands
//     updatedData['/playerDeck'] = playerDeck
//     for (let i = 0; i < playerHands.length; i++) {
//       updatedData['/players/' + playersKeyArr[i] + '/hand'] = playerHands[i]
//       updatedData['/players/' + playersKeyArr[i] + '/position'] = cdcLocation
//     }
//     return event.data.ref.update(updatedData)
//   })

// load the initial city data and add it to the room
exports.initializeCities = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    return event.data.ref.child('cities').set(cities)
  })

// // use the first nine cities on the infection deck to set infection rates for start cities
exports.initializeInfection = functions.database.ref('/rooms/{name}/infectionDeck')
  .onCreate(event => {
    const deck = event.data.val()
    const updatedData = {}
    const discardPile = [] // start the discard pile here
    const infectionRate = [3, 2, 1]
    const citiesToInfect = 3

    // go through each infection rate [3, 2, 1]
    infectionRate.forEach((rate, idx) => {
      // and infect three cities at each rate
      for (let i = 0; i < citiesToInfect; i++) {
        // some tricky math will give you the distance from the end of the array
        // i.e. the 2nd city (i = 2) to infect with a rate of 2 (idx = 1) is 3 * 1 + 2 = 5 from the end
        const distFromEnd = 3 * idx + i
        const nextCity = deck[deck.length - 1 - distFromEnd]
        // modify the infection rate for the given city
        // N.B. keys in cities object cannot include spaces, so must use hyphens
        // N.B. replace() only corrects first instance
        updatedData['cities/' + nextCity.split(' ').join('-') + '/infectionRate'] = rate
        // remove it from the infection deck
        deck.pop()
        // add it to the discard pile
        discardPile.push(nextCity)
      }
    })

    updatedData['/infectionDeck'] = deck
    updatedData['/infectionDiscard'] = discardPile

    return event.data.ref.parent.update(updatedData)
  })

// set initial current player on state
exports.rotateCurrPlayer = functions.database.ref('/rooms/{name}/state')
  .onCreate(event => {
    const currPlayer = ['player1', 'player2', 'player3', 'player4']
    const currPlayerArr = deckUtils.shuffle(currPlayer)
    const updatedCurrPlayer = {}
    return event.data.ref.set(currPlayerArr)
  })
