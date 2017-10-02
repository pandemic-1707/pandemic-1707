const allCities = require('../data/cities.js')
const allEvents = require('../data/all-events.js')
const deckUtils = require('./deck-utils.js')
const playerUtils = require('./player-utils.js')

module.exports = {

  // initial shuffle: returns all city & event cards shuffled together
  initShufflePlayerDeck: () => {
    // turn objects into arrays & shuffle
    const allCitiesArr = Object.keys(allCities).map((cityName) => {
      return { city: cityName, props: allCities[cityName] }
    })
    let playerDeck = allCitiesArr.concat(allEvents)
    deckUtils.shuffle(playerDeck)
    return playerDeck
  },

  // pick playerhands and remove cards from deck
  initDealPlayerCards: (numPlayers, playerDeck) => {
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
  },

  // add epidemic cards & shuffle
  shuffleInEpidemicsPlayerDeck: (playerDeck, numEpidemics) => {
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

}
