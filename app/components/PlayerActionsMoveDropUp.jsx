import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class PlayerActions extends Component {
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
    console.log('Dropdown changed', e.target.value)
  }

  handleConfirm = (e) => {
    e.preventDefault()
    console.log('Dropdown confirmed', this.state.selectedCity)
  }

  showConfirm = () => {
    if (this.state.selectedCityCondition) return <button type="submit" >Confirm</button>
  }

  render() {
    console.log("PLAYERS", this.props.activePlayer)
    let confirmButton = this.showConfirm()
    return (
      <div className="ui form" onSubmit={this.handleConfirm}>
        <div className="field">
          <select className="ui upward dropdown" onChange={this.handleChange} value={this.state.value} placehol>
            <option value="" disabled selected hidden>Move</option>
            {
              this.props.activePlayer && this.props.activePlayer.hand.map((card) => {
                if (card.city) {
                  return <option value={card.city}>{card.city}</option>
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
