import fire from '../../fire'

module.exports = {
  updateFireBasePlayer: (roomName, playerName, moveToCity, location, newHand, numActions) => {
    console.log("~~~~~~~~~~~~~~UPDATEFB CALLED")
    fire.database().ref(`/rooms/${roomName}/players/${playerName}`).update({
      position: { city: moveToCity, location: location },
      numActions: numActions - 1,
      hand: newHand
    })
  }
}
