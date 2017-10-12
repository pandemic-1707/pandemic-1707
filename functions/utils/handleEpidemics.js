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
        console.log('deleting the card')
        delete hand[card]
        const fetchCities = roomRef.child('cities').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDeck = roomRef.child('infectionDeck').once('value').then(snapshot => snapshot.val())
        const fetchInfectionDiscard = roomRef.child('infectionDiscard').once('value').then(snapshot => snapshot.val())
        const getOutbreaks = roomRef.child('state').child('outbreaks').once('value').then(snapshot => snapshot.val())
        const completeIncrease = increaseInfectionRate(roomRef)

        return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard, getOutbreaks, completeIncrease])
        .then(data => {
          const cities = data[0]
          const infectionDeck = data[1]
          let infectionDiscard = data[2]
          const oldOutbreaks = data[3]
          console.log('the old outbreak rate is ', oldOutbreaks)
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
          console.log('the epidemic affected')
          console.log(updatedData)
          console.log('and the number of outbreaks was')
          console.log(nOutbreaks)

          // step 3: intensify -- reshuffle infection discard and add it to pile
          const newInfectionDeck = infectionDeck.concat(shuffle(infectionDiscard))
          updatedDecks[`/players/${player}/hand`] = hand
          updatedDecks['/infectionDeck'] = newInfectionDeck
          updatedDecks['/infectionDiscard'] = []
          updatedDecks['/state/outbreaks'] = oldOutbreaks + nOutbreaks
          updatedDecks['/epidemicMessage'] = 'There was an epidemic in ' + outbreakCard
          console.log('epidemicMessage: There was an epidemic in ' + outbreakCard)
          const all = Object.assign({}, updatedDecks, updatedData)
          console.log('data to update...')
          console.log(all)
          return roomRef.update(all)
        })
      }
    }
    // necessary for Firebase speed
    return undefined
  })
}
