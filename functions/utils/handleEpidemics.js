module.exports = function(roomRef, playerRef, player) {

  playerRef.child('hand').once('value').then(snapshot => {
    const hand = snapshot.val()

    for (const card in hand) {
      if (hand[card].hasOwnProperty('Epidemic')) {
        const fetchCities = room.child('cities').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDeck = room.child('infectionDeck').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDiscard = room.child('infectionDiscard').once('value').then(snapshot => snapshot.val())
    
        return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard])
        .then(data => {
          const cities = data[0]
          const infectionDeck = data[1]
          const infectionDiscard = data[2]
          const updatedDecks = {}

          // step 2: infect -- draw the bottom card from the infection deck & add to discard
          // TO-DO: UNLESS IT'S BEEN ERADICATED
          const outbreakCard = infectionDeck.shift()
          infectionDiscard.push(outbreakCard)

          // step 2.5: check infection rate & handle the outbreak there (if necessary)
          const outbreakSite = outbreakCard.split(' ').join('-')
          const updatedOutbreakData = handleOutbreak(outbreakSite, cities)

          // step 3: intensify -- reshuffle infection discard and add it to pile
          const newInfectionDeck = infectionDeck.concat(shuffle(infectionDiscard))
          updatedDecks['/infectionDeck'] = newInfectionDeck
          updatedDecks['/infectionDiscard'] = []

          const all = Object.assign({}, updatedDecks, updatedOutbreakData)
          return room.update(all)

      }
    }
  }
  

  return Promise.all([fetchPlayerHand, fetchCities, fetchInfectionDeck, fetchInfectionDiscard])
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
