const infectionDeck = require('../data/infectionDeck')
const shuffle = require('./shuffle')

module.exports = function(roomRef) {
  const deck = shuffle(infectionDeck)
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

  return roomRef.update(updatedData)
}
