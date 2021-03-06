import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import L, { divIcon } from 'leaflet'
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'

import fire from '../../fire'
import cities from '../../functions/data/cities'
import { mapDataToPieces, mapDataToMarkers, drawLines } from '../utils/map-utils'

export default class GameMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cityMarkers: [],
      lines: [],
      peopleMarkers: [],
      loading: true
    }
  }

  componentDidMount() {
    // set the initial city markers and lines
    const cityMarkers = mapDataToMarkers(cities)
    const lines = drawLines()
    this.setState({ cityMarkers: cityMarkers, lines: lines })

    // will need this for drawing research stations later
    const stationMarker = divIcon({className: 'research-station-marker'})

    // update the markers every time there's a change to the cities in firebase
    fire.database().ref(`/rooms/${this.props.roomName}/cities`).on('value', snapshot => {
      const data = snapshot.val()
      if (data && data.Atlanta.location) this.setState({ cityMarkers: mapDataToMarkers(data) })
    })

    fire.database().ref(`/rooms/${this.props.roomName}/players`).on('value', snapshot => {
      const data = snapshot.val()
      if (Object.values(data)[0].position) this.setState({ peopleMarkers: mapDataToPieces(data) })
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }

  render() {
    const upperLeft = [64.837778, -147.716389]
    const bottomRight = [-41.286460, 174.776236]
    if (this.state.loading) {
      return (
        <div>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
      return (
        <Map id="map" center={[29.198986, 12.603998]} zoom={2} minZoom={2} maxBounds={[upperLeft, bottomRight]}>
            <TileLayer
                url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWJlYXN0bGFrZSIsImEiOiJjajd1bXJyejk0OHRxMnhwa3l1ZXVvOXY2In0.8jJCGfw_ynmjZ_4PQ4sU7g'
                attribution='OpenStreetMap'
            />
            { this.state.cityMarkers }
            { this.state.lines }
            { this.state.peopleMarkers }
        </Map>
      )
    }
  }
}
