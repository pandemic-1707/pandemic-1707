import React from 'react'
import ReactDOM from 'react-dom'
import { divIcon } from 'leaflet'
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'

import cities from '../data/all-cities'
import { drawLines } from '../utils/map-utils'

function GameMap(props) {
  const lines = drawLines()

  // an array of city markers to render on the map, colored and located based on properties
  const markers = Object.keys(cities).map(key => {
    const city = cities[key]
    // assign the color stored on city object as a class name
    const cityMarker = divIcon({className: `city-marker ${city.color}`})
    // return a marker with position and custom icon
    return <Marker key={key} position={[city.location[0], city.location[1]]} icon={cityMarker} />
  })

  const upperLeft = [64.837778, -147.716389]
  const bottomRight = [-41.286460, 174.776236]

  const stationMarker = divIcon({className: 'research-station-marker'})

  return (
    <Map style={{height: '100vh'}} bounds={[upperLeft, bottomRight]} maxBounds={[upperLeft, bottomRight]}>
        <TileLayer
            url='https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWJlYXN0bGFrZSIsImEiOiJjajd1bXJyejk0OHRxMnhwa3l1ZXVvOXY2In0.8jJCGfw_ynmjZ_4PQ4sU7g'
            attribution='OpenStreetMap'
        />
        { markers }
        { lines }
        <Marker key='research-station' position={[32.307800, -64.750500]} icon={stationMarker} />
        )}

    </Map>
  )
}

export default GameMap
