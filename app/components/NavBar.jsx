import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import Rules from './Rules'

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
      rulesOpen: false
    }
  }
  openRules() {
    this.setState({rulesOpen: true})
  }
  closeRules() {
    this.setState({rulesOpen: false})
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
        <div className='my-nice-tab-container'>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
      return (
        <nav className="navbar navbar-inverse bg-inverse navbar-toggleable-md">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <img src={'/images/redIcon.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.redTiles}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/blackIcon.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.blackTiles}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/blueIcon.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.blueTiles}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/yellowIcon.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.yellowTiles}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/infectionMarker.jpg'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.infectionRate}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/OutbreakMarker.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.outbreaks}</div>
              </li>
              <li className="nav-item">
                <img src={'/images/researchCenter.png'} width="30" height="30" alt="" />
              </li>
              <li className="nav-item">
                <div className="nav-link">{this.state.gameState.researchCenters}</div>
              </li>
              <li><WhoAmI auth={auth}/></li>
              <li className="nav-item">
                <div className="nav-link">Current Turn: {currPlayerName}</div>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-success" onClick={this.openRules}>Rules</button>
              </li>
            </ul>
          </div>
        </nav>
      )
    }
  }
}
