// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
admin.initializeApp(functions.config().firebase)

const { cities, infectionDeck, events } = require('./data')
const { shuffle, finalizePlayerDeck, handleOutbreak, incrementOutbreaks } = require('./utils')

const NUM_EPIDEMICS = 4

// shuffle the infection deck and add it to the room
exports.initializeInfectionDeck = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const shuffled = shuffle(infectionDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })

// initialize players info
exports.initializePlayerDeck = functions.database.ref('/rooms/{name}/')
  .onCreate(event => {
    const numPlayers = event.data.val().numPlayers
    const { playerDeck, hands } = finalizePlayerDeck(numPlayers, NUM_EPIDEMICS)
    console.log('hands', hands)
    const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
    const colors = [ { name: 'pink', 'hexVal': '#EB0069' },
      { name: 'blue', 'hexVal': '#00BDD8' },
      { name: 'green', 'hexVal': '#74DE00' },
      { name: 'yellow', 'hexVal': '#DEEA00' } ]
    const shuffledRoles = shuffle(roles)
    const shuffledColors = shuffle(colors)
    const updatedData = {}
    updatedData['/playerHandsArr'] = hands
    updatedData['/playerDeck'] = playerDeck
    updatedData['/shuffledRoles'] = shuffledRoles
    updatedData['/shuffledColors'] = shuffledColors
    return event.data.ref.update(updatedData)
  })

// load the initial city data and add it to the room
exports.initializeCities = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
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

// listen for changes to player's hands; if there's an epidemic card, handle it
exports.handleEpidemic = functions.database.ref('/rooms/{name}/players/{playerId}/hand')
  .onUpdate(event => {
    const hand = event.data.val()
    const room = event.data.ref.parent.parent.parent

    // TO-DO: HANDLE EACH EPIDEMIC CARD
    for (const card in hand) {
      if (hand[card].hasOwnProperty('Epidemic')) {
        const fetchCities = room.child('cities').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDeck = room.child('infectionDeck').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDiscard = room.child('infectionDiscard').once('value').then(snapshot => snapshot.val())

        return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard])
        .then(data => {
          const cities = data[0]
          const infectionDeck = data[1]
          const infectionDiscard = data[2]
          const updatedDecks = {}

          // TO-DO:
          // step 1: increase -- move the infection level forward

          // step 2: infect -- draw the bottom card from the infection deck & add to discard
          // TO-DO: UNLESS IT'S BEEN ERADICATED
          const outbreakCard = infectionDeck.shift()
          infectionDiscard.push(outbreakCard)

          // step 2.5: check infection rate & handle the outbreak there (if necessary)
          const outbreakSite = outbreakCard.split(' ').join('-')
          const { updatedOutbreakData, nOutbreaks } = handleOutbreak(outbreakSite, cities)
          incrementOutbreaks(nOutbreaks, room)

          // step 3: intensify -- reshuffle infection discard and add it to pile
          const newInfectionDeck = infectionDeck.concat(shuffle(infectionDiscard))
          updatedDecks['/infectionDeck'] = newInfectionDeck
          updatedDecks['/infectionDiscard'] = []

          const all = Object.assign({}, updatedDecks, updatedOutbreakData)
          return room.update(all)
        })
      }
    }
  })
