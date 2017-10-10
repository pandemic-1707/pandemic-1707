// moves the infection rate forward everytime there's an epidemic
module.exports = function(roomRef) {
	console.log('in increaseInfectionRate.js!')
  return roomRef.child('state').child('infectionTrack').once('value').then(snapshot => {
    const infectionTrack = snapshot.val()
    const nextRate = infectionTrack.shift()
    console.log('increased the infection rate to ' + nextRate)

    const updatedData = {
      'state/infectionRate': nextRate,
      'state/infectionTrack': infectionTrack
    }

    return roomRef.update(updatedData)
  })
}
