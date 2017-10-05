let proxyquire = require('proxyquire')
let firebasemock = require('firebase-mock')
var obj = require('./playersMoveTest.json')

let mockdatabase = new firebasemock.MockFirebase()
let mockauth = new firebasemock.MockFirebase()
let mocksdk = firebasemock.MockFirebaseSdk(function(path) {
  return path ? mockdatabase.child(path) : mockdatabase
}, function() {
  return mockauth
})
let PlayerActionMoveDropUp = proxyquire('../utils/PlayerActionFireBaseUtils', {
  fire: mocksdk
})

// testing data
const roomName = 'ishouldtest'
const playerName = 'player2'
const moveToCity = 'Chicago'
const location = 'Atlanta'
const newHand = ['dummy', 'dummy1']
const numActions = 4

// test player change move city & location
// can insert db objs into mockdatabase
// would have to test action functions to see if they make the right db updates

// PlayerActionMoveDropUp.updateFireBasePlayer(roomName, playerName, moveToCity, location, newHand, numActions)
mockdatabase.set({
  foo: 'bar'
})
mockdatabase.flush()
// data is logged
console.assert(mockdatabase.getData().foo === 'bar', 'ref has data')
console.log('MOCKDATA', mockdatabase.getData())
