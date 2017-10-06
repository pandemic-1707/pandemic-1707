import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'

// TODO: refactor what's on the state to pass down & to actually be efficient and make sense
// TODO: have buttons activate when available

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      cities: [],
      currPlayer: ''
    }
  }

  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/players`).on('value', snapshot => {
      this.setState({
        players: snapshot.val(),
      })
    })
    fire.database().ref(`/rooms/${this.props.roomName}/cities`).on('value', snapshot => {
      this.setState({
        cities: snapshot.val()
      })
    })
    fire.database().ref(`/rooms/${this.props.roomName}/state/currPlayer`).on('value', snapshot => {
      this.setState({
        currPlayer: snapshot.val(),
      })
    })
  }

  handleMoveAction = () => {
    // create popup

  }

  // returns active player uid key
  getActivePlayer = (players) => {
    const playerKeys = Object.keys(players)
    return Object.assign({ playerKey: this.state.currPlayer }, players[this.state.currPlayer])
  }

  treatDisease = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    if (this.state.cities[activePlayerCity].infectionRate > 0) {
      fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
        infectionRate: this.state.cities[activePlayerCity].infectionRate - 1
      })
      fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
        numActions: activePlayer.numActions - 1,
      })
    } else {
      // TODO: let player know this city isn't treatable, maybe fade button
    }
  }

  cureDisease = () => {
    console.log("CURE")
  }

  buildResearch = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    // check if player has city card for current location
    const buildInCity = activePlayer.hand.find(function(card) {
      return card.city === activePlayerCity
    })
    if (buildInCity) {
      // add research attribute
      fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
        research: true
      })
      fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
        numActions: activePlayer.numActions - 1,
      })
    } else {
      // TODO: let player they don't have the city card needed to build; fade button? Popup for condition?
    }
  }

  render() {
    const activePlayer = this.state.players && Object.keys(this.state.players).length && this.getActivePlayer(this.state.players)
    return (
      <div>
        <div className="container-fluid player-actions-panel">
          <div className="row">
            <div className="col-sm-2 player-action text-center">
              <PlayerActionsMoveDropUp numActions={activePlayer.numActions} activePlayer={activePlayer} roomName={this.props.roomName} />
            </div>
            <div className="col-sm-2 player-action text-center">
              <button onClick={this.treatDisease}>Treat</button>
            </div>
            <div className="col-sm-2 player-action text-center">
              <button onClick={this.treatDisease}>Cure</button>
            </div>
            <div className="col-sm-2 player-action text-center">
              <button onClick={this.buildResearch}>Build</button>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Share</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Event</span>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-sm-12 text-center">
              Actions Left: {activePlayer.numActions && activePlayer.numActions}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
