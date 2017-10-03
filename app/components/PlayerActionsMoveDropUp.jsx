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

  handleConfirm = () => {
    console.log('Dropdown confirmed', this.state.selectedCity)
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
