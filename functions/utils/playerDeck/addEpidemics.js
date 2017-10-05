const shuffle = require('../shuffle')

// add epidemic cards & shuffle
module.exports = function(playerDeck, numEpidemics) {
  // split deck into numEpidemics
  const numPerPiles = Math.floor(playerDeck.length / numEpidemics)
  const piles = []
  for (let i = 0; i < playerDeck.length; i += numPerPiles) { // num of piles = num of epidemics
    const epidemicDeck = playerDeck.slice(i, i + numPerPiles)
    // insert epidemics into each pile
    epidemicDeck.push({ Epidemic: 'epidemic' })
    // shuffle each pile
    piles.push(shuffle(epidemicDeck))
  }
  // put piles back together
  // const epidemicDeck = [].concat.apply([], piles)
  const epidemicDeckFull = flatten(piles)
  return epidemicDeckFull
}

// referenced from:
// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
const flatten = function(array) {
  return array.reduce(function(flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}
