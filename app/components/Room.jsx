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
