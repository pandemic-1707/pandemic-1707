import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'

// TODO: remove - hyphens from city names display
// TODO: charter flight: if player has city they're located in hand, allow them to pick any city on the PLANET
// TODO: shuttle: travel to research stations

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

  // todo: will there be a bug if the players somehow hit confirm before getting db callbacks?
  handleConfirm = (e) => {
    e.preventDefault()
    const moveToCity = this.state.selectedCity
    // update hand without any used city cards
    const newHand = this.props.activePlayer.hand.filter(function (card) {
      return moveToCity !== card.city
    })
    // update position and num actions left
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerName}`).update({
      position: { city: moveToCity, location: this.state.cities[moveToCity].location }, // TODO: update location coordinates
      numActions: this.props.numActions - 1,
      hand: newHand
    })
    this.setState({ selectedCityCondition: false })
  }

  render() {
    let confirmButton = this.props.numActions && this.showConfirm()
    const activePlayerCity = this.props.activePlayer && this.props.activePlayer.position
    const nearbyCities = this.props.activePlayer && this.props.activePlayer.position && this.getNearbyCities(this.props.activePlayer.position.city)
    if (this.props.activePlayer && this.props.activePlayer.position) {
      const activePlayerCity = this.props.activePlayer && this.props.activePlayer.position.city
      const canCharter = this.props.activePlayer && this.props.activePlayer.hand && this.props.activePlayer.hand.some((card) => {
        return activePlayerCity === card.city
      })
      console.log("CHARTER", canCharter)
    }
    
    const allCities = this.state.cities && Object.keys(this.state.cities)
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
            {/* display only if you have a card matching your current city */}
            <optgroup label="All Locations">

              {
                allCities.length && allCities.map(function (city) {
                  return <option key={city} value={city}>{city}</option>
                })
              }

            </optgroup>
          </select>
          {confirmButton && <button onClick={this.handleConfirm} >Confirm</button>}
        </div>
      </div>
    )
  }
}
