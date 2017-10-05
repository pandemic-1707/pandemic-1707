import React, {Component} from 'react'
import fire from '../../fire/index'
import shuffle from 'shuffle-array'
const auth = fire.auth()
import WhoAmI from './WhoAmI'

export default class Wait extends Component {
  constructor(props) {
    super(props)
    this.state = {
      LoggedIn: false,
      user: {}
    }
    this.startGame = this.startGame.bind(this)
  }
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          LoggedIn: true,
          user: user
        })
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  startGame(e) {
    e.preventDefault()
    const { user } = this.state
    fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(snapshot => {
      // assign each player's a constant offset from the city depending on numPlayers
      // guarantees that markers won't render on top of each other
      const offsets = (function(nPlayers) {
        switch (nPlayers) {
        case 2: return [[-1, -1], [-1, 1]]
        case 3: return [[0, -1], [-1, 0], [0, 1]]
        case 4: return [[0, -1], [-1, -1], [-1, 1], [0, 1]]
        }
      })(snapshot.val().numPlayers)
      let promise = null
      if (snapshot.val().players) {
        promise = fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).update({
          [user.uid]: {
            name: user.displayName || user.email
          }
        })
      } else {
        promise = fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).set({
          [user.uid]: {
            name: user.displayName || user.email
          }
        })
      }
      promise.then(() => {
        fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(newSnapshot => {
          const myOrder = Object.keys(newSnapshot.child('players').val()).indexOf(user.uid)
          console.log('myOrder', myOrder)
          const myRole = newSnapshot.val().shuffledRoles[myOrder]
          const myColor = newSnapshot.val().shuffledColors[myOrder]
          const cdcLocation = {city: 'Atlanta', location: [33.748995, -84.387982]}
          const myHand = newSnapshot.val().playerHandsArr[myOrder]
          return fire.database().ref(`/rooms/${this.props.match.params.roomName}/players/${user.uid}`).update({
            role: myRole,
            color: myColor,
            offset: offsets[myOrder],
            hand: myHand,
            position: cdcLocation
          })
          .then(() =>
            this.props.history.push(`/rooms/${this.props.match.params.roomName}`)
          )
        })
      })
    })
  }
  render() {
    return (
      <div>
        <WhoAmI auth={auth}/>
        <button onClick={this.startGame} className="btn btn-success">Enter Room</button>
      </div>
    )
  }
}
