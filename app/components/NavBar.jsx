import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import Rules from './Rules'
import EpiAlerts from './EpidemicAlerts'
import HandLimit from './HandLimitAlert'
import LostAlert from './LostAlert'
import { Menu, Button, Transition, Item } from 'semantic-ui-react'
const db = fire.database()
// Get the auth API from Firebase.
const auth = fire.auth()

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameState: {},
      currPlayer: '',
      players: {},
      loading: true, 
      isCurrPlayer: false
    }
    this.handleLogout = this.handleLogout.bind(this)
  }
  componentDidMount() {
    // component listens for changes in the game state (tiles, infection rate, outbreaks, etc.)
    db.ref(`/rooms/${this.props.roomName}/state`).on('value', snapshot => {
      const gameState = snapshot.val()
      if (gameState && gameState.blueTiles) this.setState({ gameState: gameState })
    })

    db.ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      const currPlayer = snapshot.val().state.currPlayer
      const players = snapshot.val().players
      const researchCenter = snapshot.val().state.researchCenter
      this.setState({
        currPlayer: currPlayer,
        players: players,
        researchCenter: researchCenter,
        isCurrPlayer: currPlayer === auth.currentUser.uid
      })
    })

    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }

  handleLogout(e) {
    auth.signOut()
    this.props.history.push('/')
  }

  render() {
    const { players, currPlayer, isCurrPlayer } = this.state
    let currPlayerName = ''
    if (currPlayer) {
      currPlayerName = players[currPlayer].name
    }
    if (this.state.loading) {
      return (
        <div>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
      return (
        <Menu inverted>
        <Menu.Item>
          <img className='navbar-icon' src={'/images/redIcon.png'} />
          {this.state.gameState.redTiles}
          <img className='navbar-icon' src={'/images/blackIcon.png'} />
          {this.state.gameState.blackTiles}
          <img className='navbar-icon' src={'/images/blueIcon.png'} />
          {this.state.gameState.blueTiles}
          <img className='navbar-icon' src={'/images/yellowIcon.png'} />
          {this.state.gameState.yellowTiles}
          <img className='navbar-icon' src={'/images/infectionMarker.jpg'} />
          {this.state.gameState.infectionRate}
          <img className='navbar-icon' src={'/images/OutbreakMarker.png'} />
          {this.state.gameState.outbreaks}
          <img className='navbar-icon' src={'/images/researchCenter.png'} />
          {this.state.gameState.researchCenters}
        </Menu.Item>
         <Transition
            animation='flash'
            duration='1000'
            transitionOnMount={true}>
        <Menu.Item className="currPlayer">
          Current Turn: {currPlayerName}
        </Menu.Item>
        </Transition>
        <Menu.Item>
         <Rules />
        </Menu.Item>
        <Menu.Item>
          {`Welcome, ${auth.currentUser.displayName}! `}
        </Menu.Item>
        <Menu.Item>
          <Button size="mini" color="violet"
          onClick={this.handleLogout}>Logout</Button>
        </Menu.Item>
        {
          isCurrPlayer ?
          <HandLimit roomName={this.props.roomName} currPlayer={this.state.currPlayer}/> :
          ''
        }
        <EpiAlerts roomName={this.props.roomName} currPlayer={this.state.currPlayer}/>
        <LostAlert roomName={this.props.roomName}/>
      </Menu>
      )
    }
  }
}