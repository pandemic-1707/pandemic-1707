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
      password: '',
      name: ''
    }
    this.handleLogInSubmit = this.handleLogInSubmit.bind(this)
    this.handleLogOutSubmit = this.handleLogOutSubmit.bind(this)
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this)
    this.handleRedirectGoogle = this.handleRedirectGoogle.bind(this)
  }
  handleLogInSubmit(e) {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      var user = firebase.auth().currentUser
      console.log('user', user)
      user.updateProfile({
        displayName: this.state.name
      })
      .then(() => {
        console.log('login success')
      })
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
      var user = firebase.auth().currentUser
      user.updateProfile({
        displayName: this.state.name
      })
      .then(() => {
        console.log('signup success')
      })
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
    this.props.history.push('/')
    firebase.auth().signOut()
  }
  handleRedirectGoogle(e) {
    firebase.auth().signInWithRedirect(google).catch(error => console.log(error))
  }
  render() {
    return (
      <div>
        <button className='google login'
            onClick={() => this.props.auth.signInWithPopup(google)}>Login with Google</button>
        <form>
          <input type="name" placeholder="name" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
          <input type="text" placeholder="email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
          <input type="password" placeholder="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
          <button className="btn btn-action btn-sm" onClick={this.handleLogInSubmit}>Log In</button>
          <button className="btn btn-secondary btn-sm" onClick={this.handleSignUpSubmit}>Sign Up</button>
          <button className="btn btn-action btn-sm" onClick={this.handleLogOutSubmit}>Log Out</button>
        </form>
      </div>
    )
  }
}