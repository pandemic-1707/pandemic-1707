module.exports = function(addend, room) {
  // fetch number of outbreaks
  // increment it
  return room.child('state').child('outbreaks').once('value').then(snapshot => {
    const prevVal = snapshot.val()
    const nextVal = prevVal + 1

    // check for loss condition: players must cure diseases before
    // outbreakLevel reaches 8
    if (nextVal >= 8) {
      // then you lose!
    } else {
      return room.update({ '/state/outbreaks': nextVal })
    }
  })
}
