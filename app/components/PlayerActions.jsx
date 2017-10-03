import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
    }
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

  getActivePlayer = (players) => {
    const playerKeys = Object.keys(players)
    return players[playerKeys[0]]
  }

  render() {
    return (
      <div>
        <div className="container-fluid player-actions-panel">
          <div className="row">
            <div className="col-sm-2 player-action text-center">
              <PlayerActionsMoveDropUp activePlayer={this.state.players && this.getActivePlayer(this.state.players)} />
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
            <div className="col-sm-2 player-action text-center">
              <span>Event</span>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-sm-12 text-center">
              Actions Left: {}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
