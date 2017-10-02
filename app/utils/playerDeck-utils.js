import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'
import deckUtils from './deck-utils.js'

export default {

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

  // TODO: add epidemic cards & shuffle
  // deckUtils.shuffle(playerDeck)
  // send deck to firebase
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
    [].concat.apply([], piles);
    deckUtils.shuffle(playerDeck)
    return playerDeck
  }

}
