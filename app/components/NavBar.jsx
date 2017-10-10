import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import Rules from './Rules'
import Alerts from './DealingHandsAlert'
import EpiAlerts from './EpidemicAlerts'
import { Menu, Button, Transition } from 'semantic-ui-react'
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
      loading: true
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
        researchCenter: researchCenter
      })
      if (players && currPlayer) {
        let hand = []
        if (players[currPlayer].hand) hand = players[currPlayer].hand
        if (players[currPlayer].numActions === 0) {
          // change numActions back to 4
          return db.ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
            numActions: 4
          })
          // push those 2 onto player's hand
          .then(() => {
            db.ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
              hand: [...hand, snapshot.val().playerDeck.shift()]
            })
          })
          // // check if they have more than 7 cards
          // .then(() => {
          //   db.ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).once('value').then(snapshot => {
          //     const handArr = snapshot.val().hand
          //     if (handArr.length >= 7) {
          //       alert('Please discard')
          //     }
          //   })
          // })
          // pull those 2 out of player deck
          .then(() => {
            console.log('are we getting in deck?')
            const updatedPlayerDeck = snapshot.val().playerDeck.slice(1)
            db.ref(`/rooms/${this.props.roomName}`).update({
              playerDeck: updatedPlayerDeck
            })
          })
          // update to the next currPlayer
          .then(() => {
            const currPlayersArr = snapshot.val().state.currPlayersArr
            const i = ((currPlayersArr.indexOf(currPlayer) + 1) % currPlayersArr.length)
            db.ref(`/rooms/${this.props.roomName}/state`).update({
              currPlayer: currPlayersArr[i]
            })
            this.setState({
              currPlayer: currPlayersArr[i]
            })
            console.log('currPlayer', currPlayer)
          })
        }
      }
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
    const { players, currPlayer } = this.state
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
          <img src={'/images/redIcon.png'} />
          {this.state.gameState.redTiles}
          <img src={'/images/blackIcon.png'} />
          {this.state.gameState.blackTiles}
          <img src={'/images/blueIcon.png'} />
          {this.state.gameState.blueTiles}
          <img src={'/images/yellowIcon.png'} />
          {this.state.gameState.yellowTiles}
          <img src={'/images/infectionMarker.jpg'} />
          {this.state.gameState.infectionRate}
          <img src={'/images/OutbreakMarker.png'} />
          {this.state.gameState.outbreaks}
          <img src={'/images/researchCenter.png'} />
          {this.state.gameState.researchCenters}
        </Menu.Item>
         <Transition
            animation='flash'
            duration='1000'
            transitionOnMount={true}>
        <Menu.Item>
          Current Turn: {currPlayerName}
          <Alerts />
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
        <Alerts roomName={this.props.roomName} currPlayer={this.state.currPlayer}/>
        <EpiAlerts roomName={this.props.roomName} currPlayer={this.state.currPlayer}/>
      </Menu>
      )
    }
  }
}
