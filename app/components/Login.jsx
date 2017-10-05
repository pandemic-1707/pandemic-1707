import React, {Component} from 'react'

import firebase from '../../fire/index'

const google = new firebase.auth.GoogleAuthProvider()

// Firebase has several built in auth providers:
// const facebook = new firebase.auth.FacebookAuthProvider()
// const twitter = new firebase.auth.TwitterAuthProvider()
// const github = new firebase.auth.GithubAuthProvider()
const email = new firebase.auth.EmailAuthProvider()

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
      console.log('login success')
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
      // this.props.history.push('/rooms/wait/room1')
      console.log('signup success')
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
