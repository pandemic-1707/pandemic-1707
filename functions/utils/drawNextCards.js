module.exports = function(refs) {
  const { player, playerRef, roomRef } = refs
  const fetchPlayerDeck = roomRef.child('playerDeck').once('value').then(snapshot => snapshot.val())
  const fetchPlayerHand = playerRef.child('hand').once('value').then(snapshot => snapshot.val())

  return Promise.all([fetchPlayerDeck, fetchPlayerHand])
  .then(data => {
    const updatedData = {}
    const playerDeck = data[0]
    const playerHand = data[1]

    // pop two cards off the playerDeck
    const firstCard = playerDeck.pop()
    const secondCard = playerDeck.pop()
    playerHand.push(firstCard, secondCard)

    updatedData['/playerDeck'] = playerDeck
    updatedData[`/players/${player}/hand`] = playerHand

    return roomRef.update(updatedData)
  })
}
