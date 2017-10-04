import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import axios from 'axios'

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/players`).on('value', snapshot => {
      this.setState({
        players: snapshot.val()
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
    return Object.assign({playerName: playerKeys[0]}, players[playerKeys[0]])
  }

  render() {
    const activePlayer = this.state.players && Object.keys(this.state.players).length && this.getActivePlayer(this.state.players)
    return (
      <div>
        <div className="container-fluid player-actions-panel">
          <div className="row">
            <div className="col-sm-2 player-action text-center">
              <PlayerActionsMoveDropUp numActions={activePlayer.numActions} activePlayer={activePlayer} roomName={this.props.roomName}/>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Treat</span>
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
              Actions Left: {activePlayer.numActions}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
