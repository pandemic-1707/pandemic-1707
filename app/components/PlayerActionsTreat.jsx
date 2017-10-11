import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'
import { Button } from 'semantic-ui-react'

export default class PlayerActionsTreat extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }
  treatDisease = () => {
    const activePlayer = this.props.activePlayer
    const activePlayerCity = activePlayer.position.city && activePlayer.position.city
    fire.database().ref(`/rooms/${this.props.roomName}/cities/${activePlayerCity}`).update({
      infectionRate: this.props.allCities[activePlayerCity].infectionRate - 1
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
