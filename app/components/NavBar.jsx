import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import Rules from './Rules'
import { Menu, Button } from 'semantic-ui-react'
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
  }
  componentDidMount() {
    // component listens for changes in the game state (tiles, infection rate, outbreaks, etc.)
    fire.database().ref(`/rooms/${this.props.roomName}/state`).on('value', snapshot => {
      const gameState = snapshot.val()
      if (gameState && gameState.blueTiles) this.setState({ gameState: gameState })
    })

    fire.database().ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      const currPlayer = snapshot.val().state.currPlayer
      const players = snapshot.val().players
      this.setState({
        currPlayer: snapshot.val().state.currPlayer,
        players: snapshot.val().players
      })
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
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

        <Menu.Item>
          Current Turn: {currPlayerName}
        </Menu.Item>

        <Menu.Item>
         <Rules />
        </Menu.Item>

        <Menu.Item>
          {`Welcome, ${auth.currentUser.displayName}! `}
          <Button size="mini" color="violet" onClick={() => auth.signOut()}>Logout</Button>
        </Menu.Item>
      </Menu>
      )
    }
  }
}