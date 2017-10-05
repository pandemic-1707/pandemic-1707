import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fire from '../../fire'

// TODO: remove - hyphens from city names display
// TODO: shuttle: travel to research stations

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

  // ////////// conditionally rendered movement (charter, shuttle) lists ////////////

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

  // ////////// conditionally rendered movement lists ////////////

  // //////// Confirming movement /////////

  updateFireBasePlayer = (moveToCity, newHand) => {
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerName}`).update({
      position: { city: moveToCity, location: this.state.cities[moveToCity].location },
      numActions: this.props.numActions - 1,
      hand: newHand
    })
  }

  createNewPlayerHand = (moveToCity) => {
    let newHand = []
    if (this.state.selectedType === 'hand') {
      // player used card in hand to drive/ferry directly to a city
      newHand = this.props.activePlayer.hand.filter(function(card) {
        if (card.city) {
          return moveToCity !== card.city.replace('.', '')
        } else {
          return true // always return event cards
        }
      })
    } else if (this.state.selectedType === 'charter') {
      // player used charter card to travel anywhere on the PLANET
      const charterCity = this.state.charterCity
      newHand = this.props.activePlayer.hand.filter(function(card) {
        if (card.city) {
          return charterCity !== card.city.replace('.', '')
        } else {
          return true // always return event cards
        }
      })
    } else {
      // nearby travel & research shuttles don't use cards so return original
      newHand = this.props.activePlayer.hand
    }
    return newHand
  }

  // todo: will there be a bug if the players somehow hit confirm before getting db callbacks?
  handleConfirm = (e) => {
    e.preventDefault()
    // TODO: refactor so that St.-Petersbug doesn't have a period in backend playerhand!!
    const moveToCity = this.state.selectedCity.replace('.', '') // move to selected city
    // create newHand without any used city cards
    const newHand = this.createNewPlayerHand(moveToCity)
    // update position and num actions left
    this.updateFireBasePlayer(moveToCity, newHand)
    // TODO: check if new location is charter, save charter stuff on state
    //       note: for charter availability, will need to check for 1st turn in case charter available for Atlanta
    // check if new location is research station - the research station list only pops up after the first move
    this.setState({ researchStationList: this.getResearchStationList(moveToCity) })
    this.setState({ selectedCityCondition: false })
  }

    // //////// Confirming movement /////////

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

  render() {
    let confirmButton = this.props.numActions && this.showConfirm()
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
            {/* display only if you're in research station */}
            {researchStationList}
            {/* display only if you have a card matching your current city */}
            {charter}
          </select>
          {confirmButton && <button onClick={this.handleConfirm} >Confirm</button>}
        </div>
      </div>
    )
  }
}
