import React from 'react'
import cities from '../../functions/data/cities'
import L, { divIcon } from 'leaflet'
import { Marker, Polyline, Tooltip } from 'react-leaflet'

export function mapDataToMarkers(cities) {
  return Object.keys(cities).map(key => {
    const city = cities[key]
    // only render a number of the infection rate is non-zero
    const html = city.infectionRate ? city.infectionRate : ''
    // assign the color stored on city object as a class name
    const cityMarker = divIcon({className: `city-marker ${city.color}`, html: html})
    // return a marker with position and custom icon
    return <Marker key={key} position={[city.location[0], city.location[1]]} icon={cityMarker}>
      <Tooltip direction='top' offset={[-8, -2]} opacity={1}>
        <span>{key.split('-').join(' ')}</span>
      </Tooltip>
    </Marker>
  })
}

export function mapDataToPieces(players) {
  const icons = { pinkPawn: L.icon({ iconUrl: '/pinkPawn.png', iconSize: [20, 30], iconAnchor: [10, 0] }),
    bluePawn: L.icon({ iconUrl: '/bluePawn.png', iconSize: [20, 30], iconAnchor: [10, 0] }),
    yellowPawn: L.icon({ iconUrl: '/yellowPawn.png', iconSize: [20, 30], iconAnchor: [10, 0] }),
    greenPawn: L.icon({ iconUrl: '/greenPawn.png', iconSize: [20, 30], iconAnchor: [10, 0] })
  }

  return Object.keys(players).map(key => {
    const player = players[key]
    const pawn = `${player.color.name}Pawn`
    const pieceLat = player.position.location[0] - player.offset[0]
    const pieceLng = player.position.location[1] - player.offset[1]
    return <Marker key={pawn} position={[pieceLat, pieceLng]} icon={icons[pawn]} zIndexOffset={1000} />
  })
}

export function drawLines() {
  const connections = []
  const added = {}

  Object.keys(cities).forEach(origin => {
    const start = cities[origin].location
    cities[origin].connections.forEach(destination => {
      const end = cities[destination].location
      // make up a silly stringified key to keep track of whether you drew this line already
      // sorting guarantees order doesn't mastter
      const key = [start, end].sort().toString()
      if (!added[key]) {
        added[key] = true
        // if the absolute value of the difference of the longitudes is >= 180
        // then line needs to be wrapped
        if (Math.abs(start[1] - end[1]) >= 180) {
          const segments = wrapLine(start, end)
          connections.push(<Polyline key={`${origin}-${destination}-1`} positions={segments[0]} color="white" weight="1"/>)
          connections.push(<Polyline key={`${origin}-${destination}-2`} positions={segments[1]} color="white" weight="1"/>)
        } else {
          connections.push(<Polyline key={`${origin}-${destination}`} positions={[start, end]} color="white" weight="1"/>)
        }
      }
    })
  })

  return connections
}

function wrapLine(start, end) {
  // convert locations to latitude and longitude
  let segment0 = []
  let segment1 = []
  const lat0 = start[0]
  const lng0 = start[1]
  const lat1 = end[0]
  const lng1 = end[1]

  // average latitudes of start and end to find breakpoint
  const midpoint = (lat0 + lat1) / 2

  // create first segment
  if (lng0 < 0) {
    segment0 = [[lat0, lng0], [midpoint, -179.999999]]
  } else {
    segment0 = [[lat0, lng0], [midpoint, 179.999999]]
  }

  // create second segment
  if (lng1 < 0) {
    segment1 = [[midpoint, -179.999999], [lat1, lng1]]
  } else {
    segment1 = [[midpoint, 179.999999], [lat1, lng1]]
  }

  return [segment0, segment1]
}
