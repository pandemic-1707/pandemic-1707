import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsEventDropUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      selectedCityCondition: false,
      selectedCity: ''
    }
  }

  componentDidMount() {

  }

  handleChange = (e) => {
    this.setState({ selectedCity: e.target.value })
    this.setState({ selectedCityCondition: true })
  }

  handleConfirm = (e) => {
    e.preventDefault()
    console.log('TODO: move player to ', this.state.selectedCity)
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerName}`).update({
      numActions: this.props.numActions - 1
    })
    this.setState({ selectedCityCondition: false })
  }

  showConfirm = () => {
    if (this.state.selectedCityCondition) return <button onClick={this.handleConfirm} >Confirm</button>
  }

  render() {
    let confirmButton = this.showConfirm()
    return (
      <div className="ui form" onSubmit={this.handleConfirm}>
        <div className="field">
          <select className="ui upward dropdown" onChange={this.handleChange} value={this.state.value}>
            <option value="" disabled selected hidden>Move</option>
            {
              this.props.activePlayer && this.props.activePlayer.hand && this.props.activePlayer.hand.map((card) => {
                if (card.city) {
                  return <option key={card.city} value={card.city}>{card.city}</option>
                }
              })
            }
          </select>
          {confirmButton}
        </div>
      </div>
    )
  }
}
