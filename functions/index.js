// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const { cities, infectionDeck, events } = require('./data')
const { shuffle, finalizePlayerDeck } = require('./utils')

const NUM_EPIDEMICS = 4

// shuffle the infection deck and add it to the room
exports.initializeInfectionDeck = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    const shuffled = shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })

// updated to initialize player locations at the same time
exports.initializePlayerInfo = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    // TODO : playerNumber will change
    const numPlayers = event.data.val().numPlayers
    const cdcLocation = {city: 'Atlanta', location: [33.748995, -84.387982]}
    const updatedData = {}
    // finalizePlayerDeck returns deck minus the hands for each player & starting hands
    const { playerDeck, hands } = finalizePlayerDeck(numPlayers, NUM_EPIDEMICS)
    updatedData['/playerDeck'] = playerDeck
    for (let i = 0; i < hands.length; i++) {
      updatedData['/players/player' + (i + 1) + '/hand'] = hands[i]
      updatedData['/players/player' + (i + 1) + '/position'] = cdcLocation
    }
    return event.data.ref.update(updatedData)
  })

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

    // go through each infection rate [3, 2, 1],
    // infect three cities at each rate & add to discard pile
    // N.B. keys in cities object cannot include spaces, so must use hyphens
    infectionRate.forEach((rate, idx) => {
      for (let i = 0; i < citiesToInfect; i++) {
        const nextCity = deck.pop()
        updatedData['cities/' + nextCity.split(' ').join('-') + '/infectionRate'] = rate
        discardPile.push(nextCity)
      }
    })

    updatedData['/infectionDeck'] = deck
    updatedData['/infectionDiscard'] = discardPile

    return event.data.ref.parent.update(updatedData)
  })
