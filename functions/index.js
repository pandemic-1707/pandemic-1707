// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const infectionDeck = require('./data/infectionDeck')
const cities = require('./data/cities')
const events = require('./data/events')
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
    const playerDeck = playerDeckUtils.initShufflePlayerDeck()
    console.log(playerDeck)
    return event.data.ref.child('infectionDeck').set(shuffled)
  })

// initial shuffle: returns all city & event cards shuffled together
const initShufflePlayerDeck = () => {
  // turn objects into arrays & shuffle
  const citiesArr = Object.keys(cities).map((cityName) => {
    return { city: cityName, props: cities[cityName] }
  })
  let playerDeck = citiesArr.concat(allEvents)
  deckUtils.shuffle(playerDeck)
  return playerDeck
}

// pick playerhands and remove cards from deck
const initDealPlayerCards = (numPlayers, playerDeck) => {
  // pick playerhands and remove cards from deck
  let numPlayerHandCards = 0
  // game specifies specific num of cards per player hand depending on
  // num of players
  if (numPlayers === 2) numPlayerHandCards = 4
  if (numPlayers === 3) numPlayerHandCards = 3
  if (numPlayers === 4) numPlayerHandCards = 2
  let playerHands = [] // all player hands
  for (let i = 0; i < numPlayers; i++) {
    let playerHand = [] // individual player hand
    for (let j = 0; j < numPlayerHandCards; j++) {
      playerHand.push(playerDeck.pop())
    }
    playerHands.push(playerHand)
  }
  // return playedeck and playerhands for firebase update
  return { playerDeck: playerDeck, playerhands: playerHands }
}
// add epidemic cards & shuffle
const shuffleInEpidemicsPlayerDeck = (playerDeck, numEpidemics) => {
  // split deck into numEpidemics
  const numPerPiles = Math.floor(playerDeck.length / numEpidemics)
  let piles = []
  for (let i = 0; i < numEpidemics; i += numPerPiles) { // num of piles = num of epidemics
    let epidemicDeck = playerDeck.slice(i, i + numPerPiles)
    // insert epidemics into each pile
    epidemicDeck.push({ 'Epidemic': {} })
    // shuffle each pile
    deckUtils.shuffle(epidemicDeck)
    piles.push()
  }
  // put piles back together
  [].concat.apply([], piles)
  deckUtils.shuffle(playerDeck)
  return playerDeck
}
