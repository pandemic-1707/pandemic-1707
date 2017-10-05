import React from 'react'

import firebase from '../../fire/index'

const google = new firebase.auth.GoogleAuthProvider()

// Firebase has several built in auth providers:
// const facebook = new firebase.auth.FacebookAuthProvider()
// const twitter = new firebase.auth.TwitterAuthProvider()
// const github = new firebase.auth.GithubAuthProvider()
// // This last one is the email and password login we all know and
// // vaguely tolerate:
// const email = new firebase.auth.EmailAuthProvider()

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

export default ({ auth }) =>
  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
  // redirect. If you prefer, you can signInWithRedirect, which always
  // redirects.
  <div>
    <button className='btn btn-outline-info btn-sm'
    onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
    <div className="container">
      <input id="email" type="email" placeholder="Email" />
      <input id="pwd" type="pwd" placeholder="Password" />
      <button id="buttonLogin" className="btn btn-action">Log in</button>
      <button id="buttonSignUp" className="btn btn-secondary">Sign Up</button>
      <button id="buttonLogout" className="btn btn-action hide">Log out</button>
    </div>
  </div>
