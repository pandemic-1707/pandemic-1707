// these lines load the firebase-functions and firebase-admin modules
// and initialize an admin app instance from which Realtime Database changes can be made
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https().onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })