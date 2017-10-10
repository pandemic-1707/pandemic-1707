module.exports = function(roomRef, addend) {
  // easier to handle this here than in asynchronous if-elses
  if (addend === 0) return

  // fetch number of outbreaks
  // increment it
  return roomRef.child('state').child('outbreaks').once('value').then(snapshot => {
    const prevVal = snapshot.val()
    const nextVal = prevVal + addend

    // check for loss condition: players must cure diseases before
    // outbreakLevel reaches 8
    if (nextVal >= 8) {
      // then you lose!
    } else {
      return roomRef.update({ '/state/outbreaks': nextVal })
    }
  })
}
