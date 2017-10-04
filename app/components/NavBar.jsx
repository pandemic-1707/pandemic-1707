import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'

// Get the auth API from Firebase.
const auth = fire.auth()


export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      red: 24,
      yellow: 24,
      black: 24,
      blue: 24,
      infectionIdx: 0,
      outbreaks: 0,
      researchCenter: 1,
      currPlayer: '',
      players: {},
      playerDeck: []
    }
    this.startGame = this.startGame.bind(this)
  }
  componentWillMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}`).update({state: this.state})
  }
  startGame() {
    fire.database().ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      this.setState({
        players: snapshot.val().players,
        playerDeck: snapshot.val().playerDeck
      })
    })
    let i = 0
    const shuffledCurrPlayers = shuffle(Object.keys(this.state.players))
    while (this.state.playerDeck >= 0) {
      this.setState({
        currPlayer: shuffledCurrPlayers[i % shuffledCurrPlayers.length]
      })
      for (let j = 0; j < 2; j++) {
        this.state.currPlayer.hand.append(this.state.playerDeck.pop())
      }
      i++
    }
      // fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
      //   currPlayers: Object.keys(players)
      // })
  }
  render() {
    const { players, currPlayers } = this.state
    let currPlayer = ''
    if (players && currPlayers) currPlayer = players[currPlayers[0]].name
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
              <div className="nav-link">{this.state.red}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/blackIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.black}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/blueIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.blue}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/yellowIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.yellow}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/infectionMarker.jpg'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.infection}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/OutbreakMarker.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.outbreaks}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/researchCenter.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.researchCenter}</div>
            </li>
            <li><WhoAmI auth={auth}/></li>
            <li className="nav-item">
              <button onClick={this.startGame} className="btn btn-success">Start Game</button>
            </li>
            <li className="nav-item">
              <div className="nav-link">Current Turn: {currPlayer}</div>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
