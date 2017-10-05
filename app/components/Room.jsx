import React, {Component} from 'react'
import Map from './GameMap'
import Sidebar from './Sidebar'
import PlayerActions from './PlayerActions'
import Chat from './Chat/ChatBox'
import NavBar from './NavBar'
import fire from '../../fire/index'
import WhoAmI from './WhoAmI'
import shuffle from 'shuffle-array'

const auth = fire.auth()

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      LoggedIn: false,
      numPlayers: 2
    }
  }
  componentDidMount() {
    const { numPlayers } = this.state
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          LoggedIn: true
        })
        // const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
        // const colors = [ { name: 'pink', 'hexVal': '#EB0069' },
        //   { name: 'blue', 'hexVal': '#00BDD8' },
        //   { name: 'green', 'hexVal': '#74DE00' },
        //   { name: 'yellow', 'hexVal': '#DEEA00' } ]
        // // assign each player's a constant offset from the city depending on numPlayers
        // // guarantees that markers won't render on top of each other
        // fire.database().ref(`/rooms/${this.props.match.params.roomName}`).update({
        //   shuffledRoles: shuffle(roles),
        //   shuffledColors: shuffle(colors),
        // })
        // fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(snapshot => {
        //   const offsets = (function(nPlayers) {
        //     switch (nPlayers) {
        //     case 2: return [[-1, -1], [-1, 1]]
        //     case 3: return [[0, -1], [-1, 0], [0, 1]]
        //     case 4: return [[0, -1], [-1, -1], [-1, 1], [0, 1]]
        //     }
        //   })(snapshot.val().numPlayers)
        //   fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).set({
        //     [user.uid]: {
        //       name: user.displayName,
        //     },
        //     numPlayers: snapshot.val().numPlayers
        //   })
        //   .then(() => {
        //     fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(newSnapshot => {
        //       const myOrder = Object.keys(newSnapshot.child('players').val()).indexOf(user.uid)
        //       const myRole = newSnapshot.val().shuffledRoles[myOrder]
        //       const myColor = newSnapshot.val().shuffledColors[myOrder]
        //       return fire.database().ref(`/rooms/${this.props.match.params.roomName}/players/${user.uid}`).update({
        //         role: myRole,
        //         color: myColor,
        //         offset: offsets[myOrder]
        //       })
        //     })
        //   })
        // })
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    let room = null
    if (this.state.LoggedIn) {
      room =
        <div>
          <div className="main">
            <div className="sidebar">
              <div><Sidebar roomName={this.props.match.params.roomName}/></div>
              <div><Chat /></div>
            </div>
            <div className="main-content">
              <NavBar roomName={this.props.match.params.roomName} />
              <Map roomName={this.props.match.params.roomName} />
              <footer className="footer">
                <div><PlayerActions roomName={this.props.match.params.roomName}/></div>
              </footer>
            </div>
          </div>
        </div>
    } else {
      room = <div><WhoAmI auth={auth}/></div>
    }
    return (
      <div>{room}</div>
    )
  }
}
