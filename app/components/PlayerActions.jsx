import React, { Component } from 'react'
import fire from '../../fire'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import CureCelebration from './CureCelebration'
import { Button, Menu } from 'semantic-ui-react'
import PlayerActionsCure from './PlayerActionsCure'
import cureUtils from '../utils/cure-utils.js'
import axios from 'axios'
import PlayerActionsBuild from './PlayerActionsBuild'
import PlayerActionsShare from './PlayerActionsShare'
import PlayerActionsTreat from './PlayerActionsTreat'

// TODO: refactor what's on the state to pass down & to actually be efficient and make sense
// TODO: most efficient to check for conditions after movement confirmed () =>
//  make a backend cloud func that listens for player loc change and sets state as needed
// TODO: modularize actions
// TODO: have buttons activate when available

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      cities: {},
      currPlayer: '',
      cureCards: []
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
    fire.database().ref(`/rooms/${this.props.roomName}/state/curedDiseases`).on('value', snapshot => {
      this.setState({
        cureCards: snapshot.val(),
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

  // check what other players in same city
  canShareKnowledge = (activePlayer, players) => {
    const activePlayerCity = activePlayer.position.city.replace('.', '') // st. petersburg i stg
    const playerKeys = Object.keys(players)
    let traders = []
    playerKeys.map((playerKey) => {
      if (playerKey !== activePlayer.playerKey && players[playerKey].position.city.replace('.', '') === activePlayerCity) {
        traders.push(Object.assign({ playerKey: playerKey }, players[playerKey]))
      }
    })
    return traders
  }

  canTreat = (activePlayer) => {
    const activePlayerCity = activePlayer.position.city
    return this.state.cities[activePlayerCity].infectionRate > 0
  }

  render() {
    const activePlayer = this.state.players && this.getActivePlayer(this.state.players)
    const allCities = this.state.cities && this.state.cities
    const allPlayers = this.state.players && this.state.players
    let canCure = false
    let canTreat = false
    if (activePlayer && allCities) {
      canCure = cureUtils.canCureDisease(activePlayer, allCities)
      canTreat = this.canTreat(activePlayer)
    }
    let traders = []
    if (activePlayer && activePlayer.position && activePlayer.position.city) {
      traders = this.canShareKnowledge(activePlayer, this.state.players)
    }
    return (
      <Menu inverted>
        <Menu.Item>
          <PlayerActionsMoveDropUp numActions={activePlayer.numActions} activePlayer={activePlayer} roomName={this.props.roomName} />
        </Menu.Item>
        <Menu.Item>
          <PlayerActionsTreat />
        </Menu.Item>
        <Menu.Item>
          <PlayerActionsCure roomName={this.props.roomName} curables={canCure} activePlayer={activePlayer} />
        </Menu.Item>
        <Menu.Item>
          <PlayerActionsBuild allCities={allCities} activePlayer={activePlayer} roomName={this.props.roomName} />
        </Menu.Item>
        <Menu.Item>
          <PlayerActionsShare roomName={this.props.roomName} activePlayer={activePlayer} traders={traders} />
        </Menu.Item>
        <Menu.Item>
          <Button color="teal">
            Event
        </Button>
        </Menu.Item>
        <Menu.Item>
          Actions Left: {activePlayer.numActions && activePlayer.numActions}
        </Menu.Item>
      </Menu>
    )
  }
}
