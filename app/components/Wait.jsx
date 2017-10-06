import React, {Component} from 'react'
import fire from '../../fire/index'
import shuffle from 'shuffle-array'
const auth = fire.auth()
import WhoAmI from './WhoAmI'
const NUM_STARTING_ACTIONS = 4

export default class Wait extends Component {
  constructor(props) {
    super(props)
    this.state = {
      LoggedIn: false,
      user: {},
      disabledStart: false,
      players: {},
      currPlayer: '',
      currPlayersArr: []
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
    const roomName = this.props.match.params.roomName
    fire.database().ref(`/rooms/${roomName}`).once('value').then(snapshot => {
      // set disableStart to true
      this.setState({
        disabledStart: true,
        players: snapshot.val().players
      })
      let promise = null
      if (snapshot.val().players) {
        promise = fire.database().ref(`/rooms/${roomName}/players`).update({
          [user.uid]: {
            name: user.displayName || user.email
          }
        })
      } else {
        promise = fire.database().ref(`/rooms/${roomName}/players`).set({
          [user.uid]: {
            name: user.displayName || user.email
          }
        })
      }
      // assign each player's a constant offset from the city depending on numPlayers
      // guarantees that markers won't render on top of each other
      const offsets = (function(nPlayers) {
        switch (nPlayers) {
        case 2: return [[-1, -1], [-1, 1]]
        case 3: return [[0, -1], [-1, 0], [0, 1]]
        case 4: return [[0, -1], [-1, -1], [-1, 1], [0, 1]]
        }
      })(snapshot.val().numPlayers)
      promise.then(() => {
        fire.database().ref(`/rooms/${roomName}`).once('value').then(newSnapshot => {
          console.log('shuffledRoles', newSnapshot.val().shuffledRoles)
          const myOrder = Object.keys(newSnapshot.child('players').val()).indexOf(user.uid)
          const myRole = newSnapshot.val().shuffledRoles[myOrder]
          const myColor = newSnapshot.val().shuffledColors[myOrder]
          const cdcLocation = {city: 'Atlanta', location: [33.748995, -84.387982]}
          const myHand = newSnapshot.val().playerHandsArr[myOrder]
          return fire.database().ref(`/rooms/${roomName}/players/${user.uid}`).update({
            role: myRole,
            color: myColor,
            offset: offsets[myOrder],
            hand: myHand,
            position: cdcLocation,
            numActions: NUM_STARTING_ACTIONS
          })
          .then(() => {
            const shuffledCurrPlayers = shuffle(Object.keys(newSnapshot.val().players))
            this.setState({
              currPlayersArr: shuffledCurrPlayers,
              currPlayer: shuffledCurrPlayers[0]
            })
          })
          .then(() => {
            fire.database().ref(`/rooms/${roomName}/state`).update({
              currPlayer: this.state.currPlayer,
              currPlayersArr: this.state.currPlayersArr,
              disabledStart: this.state.disabledStart
            })
          })
          .then(() => {
            if (newSnapshot.val().numPlayers !== Object.keys(newSnapshot.val().players).length) {
              alert('Waiting for your friends to join')
              this.setState({
                disabledStart: false
              })
            } else {
              this.props.history.push(`/rooms/${roomName}`)
            }
          })
        })
      })
    })
  }
  render() {
    return (
      <div>
        <WhoAmI auth={auth}/>
        <button onClick={this.startGame}
        disabled={this.state.disabledStart}
        className="btn btn-success">Enter Room</button>
      </div>
    )
  }
}
