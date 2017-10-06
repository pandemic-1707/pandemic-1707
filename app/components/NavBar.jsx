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
      red: 24,
      yellow: 24,
      black: 24,
      blue: 24,
      infectionIdx: 0,
      outbreaks: 0,
      researchCenter: 1,
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
  componentWillMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
      red: this.state.red,
      yellow: this.state.yellow,
      black: this.state.black,
      blue: this.state.blue,
      infectionIdx: this.state.infectionIdx,
      outbreaks: this.state.outbreaks,
      researchCenter: this.state.researchCenter
    })
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
