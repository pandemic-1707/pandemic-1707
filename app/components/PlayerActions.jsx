import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import axios from 'axios'

// TODO: refactor what's on the state to pass down & to actually be efficient and make sense

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      cities: [], 
      currPlayer: ''
    }

    this.handleClick = this.handleClick.bind(this)
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

  handleClick() {
    console.log('you tried to cause an epidemic! x)')
    // CHANGE TO DATABASE WRITE
    // axios.get('https://us-central1-pandemic-1707.cloudfunctions.net/propagateEpidemic')
    //   .then(() => {
    //     console.log('I got a response from my function!')
    //   })
  }

  // TODO: get the active player
  getActivePlayer = (players) => {
    const playerKeys = Object.keys(players)
    return Object.assign({ playerKey: this.state.currPlayer }, players[this.state.currPlayer])
  }

  treatDisease = () => {
    console.log('is is treating?')
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    if (this.state.cities[activePlayerCity].infectionRate > 0) {
      return fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
        infectionRate: this.state.cities[activePlayerCity].infectionRate - 1
      })
      .then(() => {
        fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
          numActions: activePlayer.numActions - 1,
        })
      })
    } else {
      // TODO: let player know this city isn't treatable, maybe fade button
    }
  }

  render() {
    const activePlayer = this.state.players && Object.keys(this.state.players).length && this.getActivePlayer(this.state.players)
    console.log('activePlayer', activePlayer)
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
            <div className="col-sm-1 player-action text-center">
              <span>Event</span>
            </div>
            <div className="col-sm-1 player-action text-center">
              <button onClick={this.handleClick}>Epidemic</button>
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
