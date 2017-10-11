import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'
import { Button } from 'semantic-ui-react'

export default class PlayerActionsTreat extends Component {
  constructor(props) {
    super(props)
    const cured = this.props.curedDiseases
    this.state = {
      treatRate: {
        black: cured['black'],
        blue: cured['blue'],
        red: cured['red'],
        yellow: cured['yellow'],
      }
    }
  }

  componentWillMount() {
    const cured = this.props.curedDiseases
    this.setState({
      treatRate: {
        black: cured['black'],
        blue: cured['blue'],
        red: cured['red'],
        yellow: cured['yellow'],
      }
    })
  }

  treatDisease = () => {
    const activePlayer = this.props.activePlayer && this.props.activePlayer
    const activePlayerCity = activePlayer.position.city && activePlayer.position.city
    const allCities = this.props.allCities && this.props.allCities
    if (this.state.treatRate[allCities[activePlayerCity].color]) {
      // cured
      fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
        infectionRate: 0
      })
    } else {
      fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
        infectionRate: allCities[activePlayerCity].infectionRate - 1
      })
    }
    fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
      numActions: activePlayer.numActions - 1,
    })
  }

  render() {
    return (
      <div>
        <Button color="blue"
          onClick={this.treatDisease}
          disabled={!this.props.canTreat}>
          Treat
        </Button>
      </div>
    )
  }
}
