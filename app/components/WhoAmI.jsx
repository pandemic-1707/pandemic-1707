import React from 'react'
import firebase from '../../fire/index'
const auth = firebase.auth()

import Login from './Login'

export const name = user => {
  if (!user) return 'Please Log In'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth, history}) =>
  <div className="whoami">
    <span className="whoami-user-name">{name(user)}</span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth} history={history}/>
      /// ...otherwise, show a logout button.
      : <div><button className='btn btn-outline-info btn-sm' onClick={() => auth.signOut()}>logout</button></div> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth, history} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth} history={history}/>
  }
}
