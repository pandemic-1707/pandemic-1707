// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const cities = require('./data/cities')
const infectionDeck = require('./data/infectionDeck')

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

// shuffle the infection deck and add it to the room
exports.initializeInfectionDeck = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const room = event.data.val()
    const shuffled = shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
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
        updatedData['cities/' + nextCity.replace(' ', '-') + '/infectionRate'] = rate
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
