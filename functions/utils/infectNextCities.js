const handleOutbreak = require('./handleOutbreak')

module.exports = function(refs) {
  console.log('infect next city')
  const { player, playerRef, roomRef } = refs

  const fetchCities = roomRef.child('cities').once('value').then(snapshot => snapshot.val())
  const fetchInfectionDeck = roomRef.child('infectionDeck').once('value').then(snapshot => snapshot.val())
  const fetchInfectionDiscard = roomRef.child('infectionDiscard').once('value').then(snapshot => snapshot.val())
  const fetchInfectionRate = roomRef.child('state').child('infectionRate').once('value').then(snapshot => snapshot.val())

  return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard, fetchInfectionRate])
  .then(data => {
    const cities = data[0]
    const infectionDeck = data[1]
    let infectionDiscard = data[2]
    const infectionRate = data[3]
    let updatedData = {}

    // need to infect as many cities as the current infection rate
    for (let i = 0; i < infectionRate; i++) {
      // N.B. need to find and replace spaces
      const city = infectionDeck.pop().split(' ').join('-')
      if (!infectionDiscard) {
        infectionDiscard = [city]
      } else {
        infectionDiscard.push(city)
      }

      const infectionRate = cities[city].infectionRate
      if (infectionRate < 3) {
        const path = 'cities/' + city + '/infectionRate'
        updatedData[path] = infectionRate + 1
        // do normal stuff
      } else {
        const { outbreakData, nOutbreaks } = handleOutbreak(city, cities)
        updatedData = Object.assign({}, updatedData, outbreakData)
      }
    }

    updatedData['/infectionDeck'] = infectionDeck
    updatedData['/infectionDiscard'] = infectionDiscard
    return roomRef.update(updatedData)
  })
}
