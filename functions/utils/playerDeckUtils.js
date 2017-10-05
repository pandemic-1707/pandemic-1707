// const cities = require('../data/citiesColors') // only city names and colors
// const events = require('../data/events.js')
// const shuffle = require('./shuffle.js')

// initial shuffle: returns a deck object of all city & event
// cards shuffled together
// const initShufflePlayerDeck = () => {
//   // turn objects into arrays & shuffle
//   const citiesArr = Object.keys(cities).map((cityName) => ({ city: cityName, props: cities[cityName] }))
//   const playerDeck = citiesArr.concat(events)
//   return shuffle(playerDeck)
// }

// // pick playerhands and remove cards from deck
// const initDealPlayerCards = (numPlayers, playerDeck) => {
//   // pick playerhands and remove cards from deck
//   let numPlayerHandCards = 0
//   // game specifies specific num of cards per player hand depending on
//   // num of players
//   if (numPlayers === 2) numPlayerHandCards = 4
//   if (numPlayers === 3) numPlayerHandCards = 3
//   if (numPlayers === 4) numPlayerHandCards = 2
//   const playerHands = [] // all player hands
//   for (let i = 0; i < numPlayers; i++) {
//     const playerHand = [] // individual player hand
//     for (let j = 0; j < numPlayerHandCards; j++) {
//       playerHand.push(playerDeck.pop())
//     }
//     playerHands.push(playerHand)
//   }
//   // return playedeck and playerhands for firebase update
//   return { playerDeck: playerDeck, playerHands: playerHands }
// }

// // referenced from:
// // https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
// const flatten = (arr) => {
//   return arr.reduce(function(flat, toFlatten) {
//     return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
//   }, [])
// }

// // add epidemic cards & shuffle
// const shuffleInEpidemicsPlayerDeck = (playerDeck, numEpidemics) => {
//   // split deck into numEpidemics
//   const numPerPiles = Math.floor(playerDeck.length / numEpidemics)
//   const piles = []
//   for (let i = 0; i < playerDeck.length; i += numPerPiles) { // num of piles = num of epidemics
//     const epidemicDeck = playerDeck.slice(i, i + numPerPiles)
//     // insert epidemics into each pile
//     epidemicDeck.push({ Epidemic: 'epidemic' })
//     // shuffle each pile
//     piles.push(shuffle(epidemicDeck))
//   }
//   // put piles back together
//   // const epidemicDeck = [].concat.apply([], piles)
//   const epidemicDeckFull = flatten(piles)
//   return epidemicDeckFull
// }

// const initPlayerDeck = (numPlayers, numEpidemics) => {
//   const initialPlayerDeck = initShufflePlayerDeck(numPlayers)
//   const playerHandsAndDeck = initDealPlayerCards(numPlayers, initialPlayerDeck)
//   const playerdeck = shuffleInEpidemicsPlayerDeck(playerHandsAndDeck.playerDeck, numEpidemics)
//   return { playerDeck: playerdeck, playerHands: playerHandsAndDeck.playerHands }
// }

// module.exports = {
//   initPlayerDeck, initShufflePlayerDeck, initDealPlayerCards, shuffleInEpidemicsPlayerDeck
// }
