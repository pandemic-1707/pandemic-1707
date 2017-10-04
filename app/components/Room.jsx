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
        const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
        const colors = [ { name: 'pink', 'hexVal': '#EB0069' },
          { name: 'blue', 'hexVal': '#00BDD8' },
          { name: 'green', 'hexVal': '#74DE00' },
          { name: 'yellow', 'hexVal': '#DEEA00' } ]
        // assign each player's a constant offset from the city depending on numPlayers
        // guarantees that markers won't render on top of each other
        const offsets = (function(nPlayers) {
          switch (nPlayers) {
          case 2: return [[-1, -1], [-1, 1]]
          case 3: return [[0, -1], [-1, 0], [0, 1]]
          case 4: return [[0, -1], [-1, -1], [-1, 1], [0, 1]]
          }
        })(numPlayers)
        // const shuffledRoles = shuffle(roles)
        // const shuffledColors = shuffle(colors)
        fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).update({
          shuffledRoles: shuffle(roles),
          shuffledColors: shuffle(colors)
        })
        fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).update({
          [user.uid]: {
            name: user.displayName
          }
        })
        fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).on('value', snapshot => {
          const myOrder = Object.keys(snapshot.val()).indexOf(user.uid)
          console.log('myOrder', myOrder)
          const myRole = snapshot.val().shuffledRoles[myOrder]
          const myColor = snapshot.val().shuffledColors[myOrder]
          fire.database().ref(`/rooms/${this.props.match.params.roomName}/players/${user.uid}`).update({
            role: myRole,
            color: myColor,
            offset: offsets[myOrder]
          })
        })
        this.setState({
          LoggedIn: true
        })
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
