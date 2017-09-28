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
  }

      // pick playerhands and remove cards from deck

    // TODO: add epidemic cards & shuffle
    // deckUtils.shuffle(playerDeck)
    // send deck to firebase

}
