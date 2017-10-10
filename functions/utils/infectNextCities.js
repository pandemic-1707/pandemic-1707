const handleOutbreak = require('./handleOutbreak')
const incrementOutbreaks = require('./incrementOutbreaks')

module.exports = function(refs) {
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
    let outbreakData = {}
    let nOutbreaks = 0

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
        const returned = handleOutbreak(city, cities)
        outbreakData = returned.updatedData
        nOutbreaks = returned.nOutbreaks
        updatedData = Object.assign({}, updatedData, outbreakData)
      }
    }

    updatedData['/infectionDeck'] = infectionDeck
    updatedData['/infectionDiscard'] = infectionDiscard
    return incrementOutbreaks(roomRef, nOutbreaks).then(() => roomRef.update(updatedData))
  })
}
