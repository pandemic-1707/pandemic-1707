const { addEpidemics, dealHands, getInitialCards } = require('./playerDeck')

module.exports = function(numPlayers, numEpidemics) {
  const initialDeck = getInitialCards(numPlayers)
  let { playerDeck, hands } = dealHands(numPlayers, initialDeck)
  playerDeck = addEpidemics(playerDeck, numEpidemics)
  return { playerDeck, hands }
}
