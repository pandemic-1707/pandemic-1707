var functions = require('firebase-functions')
const allCities = require('../data/all-cities.js')
const allEvents = require('../data/all-events.js')
const playerDeckUtils = require('./utils/playerDeck')

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https().onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })
