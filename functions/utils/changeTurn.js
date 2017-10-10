module.exports = function(refs) {
  const { player, playerRef, roomRef } = refs

  return roomRef.child('state').child('currPlayersArr').once('value').then(snapshot => {
    const currPlayersArr = snapshot.val()
    const currPlayerIdx = currPlayersArr.indexOf(player)
    const nextPlayerIdx = (currPlayerIdx + 1) % currPlayersArr.length

    return roomRef.update({'/state/currPlayer': currPlayersArr[nextPlayerIdx]})
  })
}
