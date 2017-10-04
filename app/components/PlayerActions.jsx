import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'

// TODO: refactor what's on the state to pass down & to actually be efficient and make sense

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      cities: []
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
  }

  handleMoveAction = () => {
    // create popup

  }

  // TODO: get the active player
  getActivePlayer = (players) => {
    const playerKeys = Object.keys(players)
    return Object.assign({ playerName: playerKeys[0] }, players[playerKeys[0]])
  }

  treatDisease = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    console.log("INF", this.state.cities)
    fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
      infectionRate: this.state.cities[activePlayerCity].infectionRate - 1
    })
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
              <span>Cure</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Build</span>
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
              Actions Left: {activePlayer.numActions}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
