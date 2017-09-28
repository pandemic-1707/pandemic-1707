import axios from 'axios'
import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'
import {firebase} from '../../fire/index.js'

// ACTION TYPES

const INIT_PLAYER_HAND = 'INIT_PLAYER_HAND'

// ACTION CREATORS

export function initPlayerHands(playerHands) {
  const action = { type: INIT_PLAYER_HAND, playerHands }
  return action
}

// REDUCER

const initialPlayerState = {
  hand: {},
  numRemainingActions: 0,
  location: '',
  color: '',
  role: ''
}

export default function reducer(state = {}, action) {
  switch (action.type) {
  case INIT_PLAYER_HAND:
    return Object.assign({}, state, {hand: action.playerHands})

  default:
    return state
  }
}
