import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import axios from 'axios'

const NUM_CARDS_FOR_CURE = 5

// TODO: refactor what's on the state to pass down & to actually be efficient and make sense
// TODO: most efficient to check for conditions after movement confirmed () =>
//  make a backend cloud func that listens for player loc change and sets state as needed
// TODO: modularize actions

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      cities: {},
      currPlayer: '',
      cureCards: []
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
    fire.database().ref(`/rooms/${this.props.roomName}/state/curedDiseases`).on('value', snapshot => {
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

  // TODO: get the active playercities
  getActivePlayer = (players) => {
    const playerKeys = Object.keys(players)
    return Object.assign({ playerKey: this.state.currPlayer }, players[this.state.currPlayer])
  }

  treatDisease = () => {
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

  buildResearch = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    const buildInCity = activePlayer.hand.find(function (card) {
      return card.city === activePlayerCity
    })
    if (buildInCity) {
      // check num research stations, over 6 means we have to reallocate stations
      let numResearchCenters = 0
      return fire.database().ref(`/rooms/${this.props.roomName}/state/researchCenter`).once('value', snapshot => {
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
                researchCenter: numResearchCenters + 1
              })
              // TODO: max num research stations is 6, take away from other cities when over
            })
        })
    } else {
      // TODO: let player they don't have city card, maybe fade button
    }
  }

  // ///////CURE///////
  // canCureDisease > displayCardsForCure > handleCureCardChange, handleCureCardConfirm > cureDisease > change treat func so that it will auto cure all disease

  // check if it's possible to cure disease at this city
  // TODO: refactor to only have to check if research city once 
  // returns { curableColors: curableColors, sameColors: sameColors }
  // sameColors has key=color, value = array of cards of same color
  // curableColors is array of curable colors
  // if we have no curableColors, deactivate cure button
  canCureDisease = (activePlayer, allCities) => {
    // are we in a research city?
    const activePlayerCity = activePlayer && activePlayer.position && activePlayer.position.city
    const researchCity = Object.keys(allCities).find(function (city) {
      if (city === activePlayerCity && allCities[city].research === true) {
        return city
      }
    })
    if (researchCity) {
      // do we have 5 city cards of the same color
      const sameColors = {}
      activePlayer.hand.forEach(function (card) {
        if (card.props) {
          if (sameColors[card.props.color]) sameColors[card.props.color].push(card)
          else sameColors[card.props.color] = [card]
        }
      })
      const curableColors = []
      Object.keys(sameColors).map(function (color) {
        if (sameColors[color] >= NUM_CARDS_FOR_CURE) curableColors.push(color)
      })
      if (curableColors.length) return { curableColors: curableColors, sameColors: sameColors }
      else return false
    }
    return false
  }

  // cureCards is array of cards to be discarded for cure
  cureDisease = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer && activePlayer.position && activePlayer.position.city
    // look for cure cards to discard and create newHand without the cure cards
    // const cureCards = this.state.cureCards
    const cureCards = ['Shanghai', 'Bangkok']
    const newHand = activePlayer.hand.filter(function (card) {
      // newHand can't have any cards we want to discard
      return cureCards.every(function (cureCards) {
        return card.city !== cureCards.city
      })
    })
    fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
      numActions: activePlayer.numActions - 1,
      hand: newHand
    })
    // add to curedDiseases
    fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
      curedDiseases: []
    })
    // TODO: ... have treat disease clear all 3 infection rate for the color 
  }

  render() {
    const activePlayer = this.state.players && this.getActivePlayer(this.state.players)
    const allCities = this.state.cities
    // const canCure = this.canCureDisease(activePlayer, allCities)
    const canCure = true
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
              {
                canCure && <button onClick={this.cureDisease}>Cure</button>
              }
            </div>
            <div className="col-sm-2 player-action text-center">
              <button onClick={this.buildResearch}>Build</button>
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
