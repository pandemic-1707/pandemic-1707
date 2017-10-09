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
      if (players && currPlayer) {
        const hand = players[currPlayer].hand
        if (players[currPlayer].numActions === 0) {
          // change numActions back to 4
          return fire.database().ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
            numActions: 4
          })
          // push those 2 onto player's hand
          .then(() => {
            fire.database().ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
              hand: [...hand, snapshot.val().playerDeck.shift()]
            })
          })
          // pull those 2 out of player deck
          .then(() => {
            const updatedPlayerDeck = snapshot.val().playerDeck.slice(1)
            fire.database().ref(`/rooms/${this.props.roomName}`).update({
              playerDeck: updatedPlayerDeck
            })
          })
          // update to the next currPlayer
          .then(() => {
            const currPlayersArr = snapshot.val().state.currPlayersArr
            const i = ((currPlayersArr.indexOf(currPlayer) + 1) % currPlayersArr.length)
            console.log('i', i)
            fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
              currPlayer: currPlayersArr[i]
            })
            this.setState({
              currPlayer: currPlayersArr[i]
            })
          })
        }
      }
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
          {this.state.gameState.red}
          <img src={'/images/blackIcon.png'} />
          {this.state.gameState.black}
          <img src={'/images/blueIcon.png'} />
          {this.state.gameState.blue}
          <img src={'/images/yellowIcon.png'} />
          {this.state.gameState.yellow}
          <img src={'/images/infectionMarker.jpg'} />
          {this.state.gameState.infection}
          <img src={'/images/OutbreakMarker.png'} />
          {this.state.gameState.outbreaks}
          <img src={'/images/researchCenter.png'} />
          {this.state.gameState.researchCenter}
        </Menu.Item>

        <Menu.Item>
          Current Turn: {currPlayerName}
        </Menu.Item>

        <Menu.Item>
         <Rules />
        </Menu.Item>

        <Menu.Item>
          {`Welcome, ${auth.currentUser.displayName}!`}
          <Button size="tiny" onClick={() => auth.signOut()}>Logout</Button>
        </Menu.Item>
      </Menu>
      )
    }
  }
}