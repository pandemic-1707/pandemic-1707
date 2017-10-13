import React from 'react'
import firebase from '../../fire/index'
import { Button } from 'semantic-ui-react'
const auth = firebase.auth()

import Login from './Login'

export const name = user => {
  if (!user) return 'Please Log In'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    <span className="whoami-user-name">{`Welcome, ${name(user)}!`}</span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth} />
      /// ...otherwise, show a logout button.
      : <div><Button size="tiny" color="violet" onClick={() => auth.signOut()}>logout</Button></div> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth} />
  }
}
