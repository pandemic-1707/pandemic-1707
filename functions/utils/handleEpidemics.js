const handleOutbreak = require('./handleOutbreak')
const shuffle = require('./shuffle')
const increaseInfectionRate = require('./increaseInfectionRate')

module.exports = function(refs) {
  const { player, playerRef, roomRef } = refs

  return playerRef.child('hand').once('value').then(snapshot => {
    const hand = snapshot.val()

    for (const card in hand) {
      if (hand[card].hasOwnProperty('Epidemic')) {
        console.log('coping with an epidemic!')
        const fetchCities = roomRef.child('cities').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDeck = roomRef.child('infectionDeck').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDiscard = roomRef.child('infectionDiscard').once('value').then(snapshot => snapshot.val())
        const completeIncrease = increaseInfectionRate(roomRef)

        return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard, completeIncrease])
        .then(data => {
          const cities = data[0]
          const infectionDeck = data[1]
          let infectionDiscard = data[2]
          const updatedDecks = {}

          // step 2: infect -- draw the bottom card from the infection deck & add to discard
          // TO-DO: UNLESS IT'S BEEN ERADICATED
          const outbreakCard = infectionDeck.shift()
          if (!infectionDiscard) {
            infectionDiscard = [outbreakCard]
          } else {
            infectionDiscard.push(outbreakCard)
          }

          // step 2.5: check infection rate & handle the outbreak there (if necessary)
          const outbreakSite = outbreakCard.split(' ').join('-')
          const { updatedData, nOutbreaks } = handleOutbreak(outbreakSite, cities)

          // step 3: intensify -- reshuffle infection discard and add it to pile
          const newInfectionDeck = infectionDeck.concat(shuffle(infectionDiscard))
          updatedDecks['/infectionDeck'] = newInfectionDeck
          updatedDecks['/infectionDiscard'] = []
          updatedDecks['/epidemicMessage'] = 'There was an epidemic in ' + outbreakCard
          console.log('epidemicMessage: There was an epidemic in ' + outbreakCard)
          const all = Object.assign({}, updatedDecks, updatedData)
          return roomRef.update(all)
        })
      }
    }
    // necessary for Firebase speed
    return undefined
  })
}
