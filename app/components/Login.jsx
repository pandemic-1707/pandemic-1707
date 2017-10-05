import React, {Component} from 'react'

import firebase from '../../fire/index'

const google = new firebase.auth.GoogleAuthProvider()

// Firebase has several built in auth providers:
// const facebook = new firebase.auth.FacebookAuthProvider()
// const twitter = new firebase.auth.TwitterAuthProvider()
// const github = new firebase.auth.GithubAuthProvider()
const email = new firebase.auth.EmailAuthProvider()

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

// export default ({ auth }) =>
//   // signInWithPopup will try to open a login popup, and if it's blocked, it'll
//   // redirect. If you prefer, you can signInWithRedirect, which always
//   // redirects.
//   <div>
//     <button className='btn btn-outline-info btn-sm'
//     onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
//     <div className="container">
//       <input id="email" type="email" placeholder="Email" />
//       <input id="pwd" type="pwd" placeholder="Password" />
//       <button id="buttonLogin" className="btn btn-action">Log in</button>
//       <button id="buttonSignUp" className="btn btn-secondary">Sign Up</button>
//       <button id="buttonLogout" className="btn btn-action hide">Log out</button>
//     </div>
//   </div>

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleLogInSubmit = this.handleLogInSubmit.bind(this)
    this.handleLogOutSubmit = this.handleLogOutSubmit.bind(this)
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this)
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log('current user', firebaseUser)
      } else {
        console.log('not logged in')
      }
    })
  }
  handleLogInSubmit(e) {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.props.history.push('/rooms/wait/room1')
    })
    .catch(error => {
      var errorCode = error.code
      var errorMessage = error.message
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.')
      } else {
        alert(errorMessage)
      }
      console.log(error)
    })
  }
  handleSignUpSubmit(e) {
    e.preventDefault()
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.props.history.push('/rooms/wait/room1')
    })
    .catch(error => {
      var errorCode = error.code
      var errorMessage = error.message
      // [START_EXCLUDE]
      if (errorCode === 'auth/weak-password') {
        alert('The password is too weak.')
      } else {
        alert(errorMessage)
      }
      console.log(error)
    })
  }
  handleLogOutSubmit(e) {
    e.preventDefault()
    firebase.auth().signOut()
  }
  render() {
    return (
      <form>
        <button className='btn btn-outline-info btn-sm'
        onClick={() => this.props.auth.signInWithPopup(google)}>Login with Google</button>
        <input type="text" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
        <input type="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
        <button className="btn btn-action" onClick={this.handleLogInSubmit}>Log In</button>
        <button className="btn btn-secondary" onClick={this.handleSignUpSubmit}>Sign Up</button>
        <button className="btn btn-action" onClick={this.handleLogOutSubmit}>Log Out</button>
      </form>
    )
  }
}
