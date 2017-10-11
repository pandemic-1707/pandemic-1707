import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'
import { Button } from 'semantic-ui-react'

const NORMAL_DEC_RATE = 1
const CURED_DEC_RATE = 3

export default class PlayerActionsTreat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      black: 1,
      blue: 1,
      red: 1,
      yellow: 1
    }
  }

  componentDidMount() {
    const cured = this.props.curedDiseases
    this.setState({
      treatRate: {
        black: cured['black'] ? CURED_DEC_RATE : NORMAL_DEC_RATE,
        blue: cured['blue'] ? CURED_DEC_RATE : NORMAL_DEC_RATE,
        red: cured['red'] ? CURED_DEC_RATE : NORMAL_DEC_RATE,
        yellow: cured['yellow'] ? CURED_DEC_RATE : NORMAL_DEC_RATE,
      }
    })
  }

  treatDisease = () => {
    const activePlayer = this.props.activePlayer && this.props.activePlayer
    const activePlayerCity = activePlayer.position.city && activePlayer.position.city
    const allCities = this.props.allCities && this.props.allCities
    fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
      infectionRate: allCities[activePlayerCity].infectionRate - this.state.treatRate[allCities[activePlayerCity].color]
    })
      .then(() => {
        fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
          numActions: activePlayer.numActions - 1,
        })
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
