// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
admin.initializeApp(functions.config().firebase)

const { state, cities, infectionDeck, events } = require('./data')
const { shuffle, finalizePlayerDeck, drawNextCards,
  handleEpidemics, infectNextCities, changeTurn,
  initializeInfection } = require('./utils')

const NUM_EPIDEMICS = 4

// set the initial game state
exports.initializeState = functions.database.ref('/rooms/{name}')
  .onCreate(event => event.data.ref.child('state').set(state))

// load the initial city data and add it to the room
exports.initializeCities = functions.database.ref('/rooms/{name}')
  .onCreate(event => {
    const roomRef = event.data.ref
    return roomRef.child('cities').set(cities)
      .then(() => initializeInfection(roomRef))
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

// update the tiles any time an infection rate changes
exports.updateTiles = functions.database.ref('/rooms/{name}/cities/{city}/infectionRate')
  .onUpdate(event => {
    const stateRef = event.data.ref.parent.parent.parent.child('state')
    const difference = event.data.val() - event.data.previous.val()
    const color = cities[event.params.city].color + 'Tiles'

    return stateRef.child(color).once('value').then(snapshot => {
      const oldCount = snapshot.val()
      const newCount = oldCount - difference
      return stateRef.update({[color]: newCount})
    })
  })

// listen for a player's actions to run out (i.e. the end of their turn)
exports.handleTurnChange = functions.database.ref('/rooms/{name}/players/{player}/numActions')
  .onUpdate(event => {
    const turnsRemaining = event.data.val()
    const refs = {
      player: event.params.player,
      playerRef: event.data.ref.parent,
      roomRef: event.data.ref.parent.parent.parent
    }

    // when a player's turn is over, draw their next two cards,
    // handle any epidemics and then infect the appropriate number of cities (based on infection rate)
    // then update the current player!
    if (turnsRemaining === 0) {
      return drawNextCards(refs)
      .then(() => handleEpidemics(refs))
      .then(() => infectNextCities(refs))
      .then(() => changeTurn(refs))
      .then(() => {
        console.log('i finished!')
      })
    }
  })
