import axios from 'axios'
import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'
import utils from '../utils/playerDeck-utils.js'
import {firebase} from '../../fire/index.js'
import {initPlayerHands} from './players.js'

// ACTION TYPES

const INIT_PLAYER_DECK = 'INIT_PLAYER_DECK'

// ACTION CREATORS

export function initPlayerDeck(numPlayers) {
  const action = { type: INIT_PLAYER_DECK, numPlayers }
  return action
}

// THUNK CREATORS

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
  case INIT_PLAYER_DECK:
    return utils.initializePlayerDeck(action.numPlayers)

  default:
    return state
  }
}
