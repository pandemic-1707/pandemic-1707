// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
admin.initializeApp(functions.config().firebase)

<<<<<<< HEAD
const { state, cities, infectionDeck, events } = require('./data')
const { shuffle, finalizePlayerDeck, drawNextCards,
  handleEpidemics, infectNextCities, changeTurn,
  initializeInfection } = require('./utils')
=======
const { cities, infectionDeck, events } = require('./data')
const { shuffle, finalizePlayerDeck, handleOutbreak, incrementOutbreaks } = require('./utils')
>>>>>>> master

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
    const 
    Ref = event.data.ref.parent.parent.parent.child('state')
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
<<<<<<< HEAD
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
=======
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
          const { updatedData, nOutbreaks } = handleOutbreak(outbreakSite, cities)
          incrementOutbreaks(nOutbreaks, room)

          // step 3: intensify -- reshuffle infection discard and add it to pile
          const newInfectionDeck = infectionDeck.concat(shuffle(infectionDiscard))
          updatedDecks['/infectionDeck'] = newInfectionDeck
          updatedDecks['/infectionDiscard'] = []

          const all = Object.assign({}, updatedDecks, updatedData)
          return room.update(all)
        })
      }
>>>>>>> master
    }
  })
