const handleOutbreak = require('./handleOutbreak')
const arrayToSentence = require('array-to-sentence')

module.exports = function(refs) {
  console.log('infect next city')
  const { player, playerRef, roomRef } = refs
  console.log('infecting cities')

  const fetchCities = roomRef.child('cities').once('value').then(snapshot => snapshot.val())
  const fetchInfectionDeck = roomRef.child('infectionDeck').once('value').then(snapshot => snapshot.val())
  const fetchInfectionDiscard = roomRef.child('infectionDiscard').once('value').then(snapshot => snapshot.val())
  const fetchInfectionRate = roomRef.child('state').child('infectionRate').once('value').then(snapshot => snapshot.val())
  const getOutbreaks = roomRef.child('state').child('outbreaks').once('value').then(snapshot => snapshot.val())

  return Promise.all([fetchCities, fetchInfectionDeck, fetchInfectionDiscard, fetchInfectionRate, getOutbreaks])
  .then(response => {
    const cities = response[0]
    const infectionDeck = response[1]
    let infectionDiscard = response[2]
    const infectionRate = response[3]
    const oldOutbreaks = response[4]
    let data = {}
    const infectionsToBroadcast = []
    let nOutbreaks = 0
    let updatedData = {}
    console.log('got here')

    // need to infect as many cities as the current infection rate
    for (let i = 0; i < infectionRate; i++) {
      // N.B. need to find and replace spaces
      let city = infectionDeck.pop()
      infectionsToBroadcast.push(city)
      console.log(city + 'is infected next')
      city = city.split(' ').join('-')
      if (!infectionDiscard) {
        infectionDiscard = [city]
      } else {
        infectionDiscard.push(city)
      }

      const infectionRate = cities[city].infectionRate
      if (infectionRate < 3) {
        console.log('it didnt cause an outbreak')
        const path = 'cities/' + city + '/infectionRate'
        data[path] = infectionRate + 1
        // do normal stuff
      } else {
        const result = handleOutbreak(city, cities)
        updatedData = result.updatedData
        nOutbreaks = result.nOutbreaks
        data = Object.assign({}, data, updatedData)
      }
    }

    const infectionMessage = arrayToSentence(infectionsToBroadcast) + ' were infected next!'
    console.log('n outbreaks here ', nOutbreaks)
    data['/state/outbreaks'] = oldOutbreaks + nOutbreaks
    data['/infectionDeck'] = infectionDeck
    data['/infectionDiscard'] = infectionDiscard
    data['/infectionMessage'] = infectionMessage
    console.log('data here', data)
    return roomRef.update(data)
  })
}
