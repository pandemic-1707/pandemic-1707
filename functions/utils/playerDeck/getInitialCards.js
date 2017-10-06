const shuffle = require('../shuffle')
const cities = require('../../data/citiesColors')
const events = require('../../data/events.js')

module.exports = function() {
  // turn objects into arrays & shuffle
  const citiesArr = Object.keys(cities).map((cityName) => ({ city: cityName, props: cities[cityName] }))
  const playerDeck = citiesArr.concat(events)
  return shuffle(playerDeck)
}
