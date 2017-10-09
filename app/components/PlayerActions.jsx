import React, { Component } from 'react'
import fire from '../../fire'
import PlayerActionsMoveDropUp from './PlayerActionsMoveDropUp'
import cureUtils from '../utils/cure-utils.js'
import {Button, Menu} from 'semantic-ui-react'

const NUM_CARDS_FOR_CURE = 5

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

  treatDisease = () => {
    const activePlayer = this.getActivePlayer(this.state.players)
    const activePlayerCity = activePlayer.position.city
    if (this.state.cities[activePlayerCity].infectionRate > 0) {
      fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
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
    const activePlayer = this.state.players && this.getActivePlayer(this.state.players)
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

  // allow player to choose 5 cards to discard for cure
  // takes obj of form { curableColors: curableColors, sameColors: sameColors }
  // from canCureDisease
  // TODO: after confirm: if (curables.curableColors.length) this.displayCardsForCure
  // TODO: check that cards are all same color
  displayCardsForCure = (curables) => {
    const curableColors = curables.curableColors
    const sameColors = curables.sameColors
    console.log("DISPLAY CURE CARDS", curableColors, sameColors)
    return (
      <div>
        <select id="select-cards-for-cure" className="ui upward dropdown" multiple>
          {
            sameColors['blue'].map(function (card) {
              const cityName = card.city
              return <option key={cityName} value={cityName}>
                <input id="checkBox" type="checkbox"></input> {cityName}
                </option>
            })
          }
        </select>
        <button onClick={this.handleCureCardConfirm} >Confirm</button>
      </div>
    )
  }

  render() {
    const activePlayer = this.state.players && this.getActivePlayer(this.state.players)
    const allCities = this.state.cities
    // const canCure = cureUtils.canCureDisease(activePlayer, allCities)

    const canCure = {
      curableColors: ['blue'],
      sameColors: {
        blue: [
          {
            'city': 'Atlanta',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Chicago',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Essen',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Madrid',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Milan',
            'props': {
              'color': 'blue'
            }
          }
        ]
      }
    }

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    console.log("ACTIVE PLAYER", activePlayer)
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
