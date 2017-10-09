const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
const config = {
  apiKey: "AIzaSyAGBkAvlLOydiC7O_BOqV5XxiYuj-MZ1EE",
  authDomain: "pandemic-1707.firebaseapp.com",
  databaseURL: "https://pandemic-1707.firebaseio.com",
  projectId: "pandemic-1707",
  storageBucket: "pandemic-1707.appspot.com",
  messagingSenderId: "1029700706030"
}

// const config = {
//   apiKey: "AIzaSyDEXSwSvp-dKXB8wJPgHD_HUNyvMS7DmU8",
//   authDomain: "my-pandemic-dev.firebaseapp.com",
//   databaseURL: "https://my-pandemic-dev.firebaseio.com",
//   projectId: "my-pandemic-dev",
//   storageBucket: "",
//   messagingSenderId: "728951653926"
// }

// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
