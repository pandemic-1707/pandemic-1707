import React, { Component } from 'react'
import { Dropdown, Button } from 'semantic-ui-react'
import fire from '../../fire'

// TODO: remove - hyphens from city names display

export default class PlayerActionMoveDropUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      selectedCityCondition: false,
      selectedCity: '',
      selectedType: '',
      charterCity: '',
      researchStationList: '',
      cities: []
    }
    this.activePlayerCity = this.props.activePlayer && this.props.activePlayer.position
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

  // check if you have a charter city in hand (if you have a city in hand that matches the city you're in )
  // returns the charter city object
  checkCharterCity = () => {
    if (this.props.activePlayer && this.props.activePlayer.position) {
      const cityName = this.props.activePlayer && this.props.activePlayer.position && this.props.activePlayer.position.city
      const charterCity = this.props.activePlayer && this.props.activePlayer.hand && this.props.activePlayer.hand.find(function(card) {
        return cityName === card.city
      })
      if (charterCity) return charterCity
      else return null
    }
    return null
  }

  // returns jsx list of all cities if charter is possible
  getCharterCityList = () => {
    const allCities = this.state.cities && Object.keys(this.state.cities)
    const charterCity = this.checkCharterCity()
    if (charterCity) {
      return (
        <optgroup label={`Use ${charterCity.city} to charter flight to ANYWHERE`}>
          {allCities && allCities.length && allCities.map(function(city) {
            return <option key={city} value={city + ':charter'}>{city}</option>
          })
          }
        </optgroup>
      )
    }
  }

  // changes to the dropdown selection
  handleChange = (e) => {
    // e.target.value comes in format city:type_of_move (ie Milan:nearby, Paris:hand, Chennai:charter)
    const selectedCityStr = e.target.value.split(':')
    // check if we have a charter city selected
    const charterCity = this.checkCharterCity()
    // if so, keep track of which card is the charter
    // need to checkCharterCity here also to have setstate only on handleChange
    if (selectedCityStr[1] === 'charter') {
      this.setState({ charterCity: charterCity.city })
    } else {
      this.setState({ charterCity: '' })
    }
    this.setState({ selectedCity: selectedCityStr[0] })
    this.setState({ selectedType: selectedCityStr[1] })
    this.setState({ selectedCityCondition: true })
  }

  // todo: will there be a bug if the players somehow hit confirm before getting db callbacks?
  handleConfirm = (e) => {
    e.preventDefault()
    const moveToCity = this.state.selectedCity.replace('.', '')
    // TODO: refactor so that St.-Petersbug doesn't have a period in backend playerhand!!
    // update hand without any used city cards
    let newHand = []
    if (this.state.selectedType === 'hand') {
      newHand = this.props.activePlayer.hand.filter(function(card) {
        if (card.city) {
          return moveToCity !== card.city.replace('.', '')
        } else {
          return true
        }
      })
    } else if (this.state.selectedType === 'charter') {
      const charterCity = this.state.charterCity
      newHand = this.props.activePlayer.hand.filter(function(card) {
        if (card.city) {
          return charterCity !== card.city.replace('.', '')
        } else {
          return true
        }
      })
    } else {
      newHand = this.props.activePlayer.hand
    }
    // update position and num actions left
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerKey}`).update({
      position: { city: moveToCity, location: this.state.cities[moveToCity].location },
      numActions: this.props.numActions - 1,
      hand: newHand
    })
    // TODO: check if new location is charter, save charter stuff on state
    // check if new location is research station - the research station list only pops up after the first move
    this.setState({ researchStationList: this.getResearchStationList(moveToCity) })
    this.setState({ selectedCityCondition: false })
  }

  // if active player location has research station return list to other research stations
  getResearchStationList = (moveToCity) => {
    const allCities = this.state.cities && this.state.cities
    if (allCities[moveToCity].research) {
      const cityNames = Object.keys(allCities)
      return (
        <optgroup label={`Research Station Shuttle Flight`}>
          {cityNames.map(function(city) {
            if (allCities[city].research) {
              return <option key={city} value={city + ':research'}>{city}</option>
            }
          })
          }
        </optgroup>
      )
    }
  }

  render() {
    const confirmButton = this.props.numActions && this.showConfirm()
    const nearbyCities = this.props.activePlayer && this.props.activePlayer.position && this.getNearbyCities(this.props.activePlayer.position.city)
    // check if charter available
    const charter = this.getCharterCityList()
    const researchStationList = this.state.researchStationList
    return (
      <div className="ui form">
        <div className="field">
          <select className="ui upward dropdown" onChange={this.handleChange} value={this.state.value}>
            <option value="" disabled selected hidden>Move</option>
            <optgroup label="Nearby (drive/ferry)">
              {
                nearbyCities && nearbyCities.map((cityName) => {
                  return <option key={cityName} value={cityName + ':nearby'}>{cityName}</option>
                })
              })
              }
            </optgroup>
            <optgroup label="Player Hand (direct flight)">
              {
                this.props.activePlayer && this.props.activePlayer.hand && this.props.activePlayer.hand.map((card) => {
                  if (card.city) {
                    return <option key={card.city} value={card.city + ':hand'}>{card.city}</option>
                  }
                })
              }
            </optgroup>
            {researchStationList}
            {/* display only if you have a card matching your current city */}
            {charter}
          </select>
          {confirmButton && <Button size="mini" onClick={this.handleConfirm} >Confirm</Button>}
        </div>
      </div>
    )
  }
}
