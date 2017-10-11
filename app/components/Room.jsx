import React, {Component} from 'react'
import Map from './GameMap'
import Sidebar from './Sidebar'
import PlayerActions from './PlayerActions'
import PlayerActionsInactive from './PlayerActionsInactive'
import Chat from './Chat'
import NavBar from './NavBar'
import fire from '../../fire/index'
import WhoAmI from './WhoAmI'
import shuffle from 'shuffle-array'
const db = fire.database()
const auth = fire.auth()

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      LoggedIn: false,
      numPlayers: 2,
      userId: '',
      isCurrentPlayer: false
    }
  }
  componentDidMount() {
    const { numPlayers } = this.state
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          LoggedIn: true,
          userId: user.uid
        })
        fire.database().ref(`/rooms/${this.props.match.params.roomName}/state`).on('value', snapshot => {
          const currPlayer = snapshot.val().currPlayer
          this.setState({
            isCurrentPlayer: currPlayer === user.uid
          })
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
          <div className="site">
            <div className="sidebar-container">
              <div className="sidebar">
                <div className="player-area">
                  <Sidebar roomName={this.props.match.params.roomName}/>
                </div>
                <div className="chat-area">
                  <Chat auth={auth} roomRef={db.ref(`/rooms/${this.props.match.params.roomName}`)} fireRef={db.ref(`/rooms/${this.props.match.params.roomName}/chat`)} />
                </div>
              </div>
            </div>
            <div className="main-content">
              <header><NavBar roomName={this.props.match.params.roomName} history={this.props.history}/></header>
              <Map roomName={this.props.match.params.roomName} />
            </div>
            <footer className="footer">
                {
                  this.state.isCurrentPlayer ?
                  (<div><PlayerActions roomName={this.props.match.params.roomName}/></div>) :
                  (<div><PlayerActionsInactive roomName={this.props.match.params.roomName} /></div>)
                }
            </footer>
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
