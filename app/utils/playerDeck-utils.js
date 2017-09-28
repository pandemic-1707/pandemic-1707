import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'

export default {

  // referenced from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  shuffle: (a) => {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]]
    }
  },

  initializePlayerDeck: (numPlayers) => {
    // randomize deck
    // turn objects into arrays
    const allCitiesArr = Object.keys(allCities).map((cityName) => {
      return { city: cityName, props: allCities[cityName] }
    })
    // TODO: more efficient way to sort objects array?
    let playerDeck = allCitiesArr.concat(allEvents)
    this.shuffle(playerDeck)
    // pick playerhands and remove cards from deck
    let numPlayerDrawnCards = 0
    // game specifies specific num of cards per player depending on
    // num of players
    if (numPlayers === 2) numPlayerDrawnCards = 4
    if (numPlayers === 3) numPlayerDrawnCards = 3
    if (numPlayers === 4) numPlayerDrawnCards = 2
    let playerHands = [] // all player hands
    for (let i = 0; i < numPlayers; i++) {
      let playerHand = [] // individual player hand
      for (let j = 0; j < numPlayerDrawnCards; j++) {
        playerHand.push(playerDeck.pop())
      }
      playerHands.push(playerHand)
    }
    // send playerhands to store & firebase
    console.log("hands", playerHands)
    initPlayerHands(playerHands)
    // randomize deck
    // TODO: add epidemic cards
    shuffle(playerDeck)
    // send deck to firebase
    return playerDeck
  }

}
