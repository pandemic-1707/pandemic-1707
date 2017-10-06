// pick playerhands and remove cards from deck
module.exports = function(numPlayers, playerDeck) {
  // pick playerhands and remove cards from deck
  let numPlayerHandCards = 0
  // game specifies specific num of cards per player hand depending on
  // num of players
  if (numPlayers === 2) numPlayerHandCards = 4
  if (numPlayers === 3) numPlayerHandCards = 3
  if (numPlayers === 4) numPlayerHandCards = 2
  const hands = [] // all player hands
  for (let i = 0; i < numPlayers; i++) {
    const hand = [] // individual player hand
    for (let j = 0; j < numPlayerHandCards; j++) {
      hands.push(playerDeck.pop())
    }
    hands.push(hand)
  }
  // return playedeck and playerhands for firebase update
  return { playerDeck: playerDeck, hands: hands }
}
