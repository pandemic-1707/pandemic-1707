import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'
import { Button } from 'semantic-ui-react'

export default class PlayerActionsBuild extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  buildResearch = () => {
    const activePlayer = this.props.activePlayer
    const activePlayerCity = activePlayer.position.city.replace('.', '')
    const allCities = this.props.allCities
    // does this city already have a research station?
    const isResearchCity = allCities[activePlayerCity].research === true
    if (isResearchCity) {
      return // if so, can't build research station
    }
    // do we have the city card to use?
    const buildInCity = activePlayer.hand.find(function(card) {
      if (card.city) {
        return card.city.replace('.', '') === activePlayerCity
      }
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
    return (
      <div>
        <Button
          onClick={this.buildResearch}
        >Build
        </Button>
      </div>
    )
  }
}
