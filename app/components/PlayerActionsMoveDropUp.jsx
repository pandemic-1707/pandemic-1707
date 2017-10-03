import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'

// TODO: remove - from city names display

export default class PlayerActionMoveDropUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      selectedCityCondition: false,
      selectedCity: '',
      cities: []
    }
  }

  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/cities`).on('value', snapshot => {
      this.setState({
        cities: snapshot.val()
      })
    })
  }

  showConfirm = () => {
    return this.state.selectedCityCondition && this.props.numActions > 0
  }

  getNearbyCities = (cityName) => {
    if (this.state.cities[cityName]) {
      return this.state.cities[cityName].connections
    }
  }

  // changes to the dropdown selection
  handleChange = (e) => {
    this.setState({ selectedCity: e.target.value })
    this.setState({ selectedCityCondition: true })
  }

  handleConfirm = (e) => {
    e.preventDefault()
    const moveToCity = this.state.selectedCity
    // remove city card if used
    const newHand = this.props.activePlayer.hand.filter(function(card) {
      return moveToCity !== card.city
    })
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerName}`).update({
      position: {city: moveToCity, location: [33.748995, -84.387982]}, // TODO: update location coordinates
      numActions: this.props.numActions - 1,
      hand: newHand
    })
    this.setState({ selectedCityCondition: false })
  }

  render() {
    let confirmButton = this.props.numActions && this.showConfirm()
    const nearbyCities = this.props.activePlayer && this.props.activePlayer.position && this.getNearbyCities(this.props.activePlayer.position.city)
    return (
      <div className="ui form" onSubmit={this.handleConfirm}>
        <div className="field">
          <select className="ui upward dropdown" onChange={this.handleChange} value={this.state.value}>
            <option value="" disabled selected hidden>Move</option>
            <optgroup label="Nearby (drive/ferry)">
              {
                nearbyCities && nearbyCities.map((city) => {
                  return <option key={city} value={city}>{city}</option>
                })
              })
              }
            </optgroup>
            <optgroup label="Player Hand (direct flight)">
              {
                this.props.activePlayer && this.props.activePlayer.hand && this.props.activePlayer.hand.map((card) => {
                  if (card.city) {
                    return <option key={card.city} value={card.city}>{card.city}</option>
                  }
                })
              }
            </optgroup>
          </select>
          { confirmButton && <button onClick={this.handleConfirm} >Confirm</button>}
        </div>
      </div>
    )
  }
}
