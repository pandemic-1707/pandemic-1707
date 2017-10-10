import React, { Component } from 'react'
import fire from '../../fire'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import axios from 'axios'
import { Button, Menu } from 'semantic-ui-react'

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

  buildResearch = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    const allCities = this.state.cities
    // does this city already have a research station?
    const isResearchCity = allCities[activePlayerCity].research === true
    if (isResearchCity) {
      return // if so, can't build research station
    }
    // do we have the city card to use?
    const buildInCity = activePlayer.hand.find(function (card) {
      return card.city === activePlayerCity
    })
    if (buildInCity) {
      // check num research stations, over 6 means we have to reallocate stations
      let numResearchCenters = 0
      return fire.database().ref(`/rooms/${this.props.roomName}/state/researchCenters`).once('value', snapshot => {
        numResearchCenters = snapshot.val()
      })
        .then(() => {
          // set city to have research station
          return fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
            research: true
          })
            .then(() => {
              // discard used city card by creating newHand without it
              const newHand = activePlayer.hand.filter(function (card) {
                return card.city !== buildInCity.city
              })
              fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
                numActions: activePlayer.numActions - 1,
                hand: newHand
              })
              // add num research stations to game state
              fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
                researchCenters: numResearchCenters - 1
              })
              // TODO: max num research stations is 6, take away from other cities when over
            })
        })
    } else {
      // TODO: let player they don't have city card, maybe fade button
    }
  }

  render() {
    const activePlayer = this.state.players && Object.keys(this.state.players).length && this.getActivePlayer(this.state.players)
    console.log("RENDERING")
    return (
      <Menu inverted>
        <Menu.Item>
          <PlayerActionsMoveDropUp numActions={activePlayer.numActions} activePlayer={activePlayer} roomName={this.props.roomName} />
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={this.treatDisease}>Treat
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={this.treatDisease}
          >
            Cure
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={this.buildResearch}
          >
            Build
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button>
            Share
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button>
            Event
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={this.handleClick}>Epidemic
        </Button>
        </Menu.Item>
        <Menu.Item>
          Actions Left: {activePlayer.numActions && activePlayer.numActions}
        </Menu.Item>
      </Menu>
    )
  }
}
