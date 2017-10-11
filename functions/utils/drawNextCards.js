module.exports = function(refs) {
  console.log('draw next card')
  const { player, playerRef, roomRef } = refs
  const fetchPlayerDeck = roomRef.child('playerDeck').once('value').then(snapshot => snapshot.val())
  const fetchPlayerHand = playerRef.child('hand').once('value').then(snapshot => snapshot.val())

  return Promise.all([fetchPlayerDeck, fetchPlayerHand])
  .then(data => {
    const updatedData = {}
    const playerDeck = data[0]
    let playerHand = data[1]

    // pop two cards off the playerDeck
    const firstCard = playerDeck.pop()
    const secondCard = playerDeck.pop()
    if (playerHand) {
      playerHand.push(firstCard, secondCard)
    } else {
      playerHand = [firstCard, secondCard]
    }

    updatedData['/playerDeck'] = playerDeck
    updatedData[`/players/${player}/hand`] = playerHand
    updatedData[`/players/${player}/resolved`] = false

    return roomRef.update(updatedData)
  })
}
