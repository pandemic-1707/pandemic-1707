import axios from 'axios'
import allCities from '../all-cities.js'
import allEvents from '../all-events.js'
import {firebase} from '../../fire/index.js'

// ACTION TYPES

const INIT_PLAYER_HAND = 'INIT_PLAYER_HAND'

// ACTION CREATORS

export function initPlayerHand(playerHands) {
  const action = { type: INIT_PLAYER_HAND, playerHands }
  return action
}

// THUNK CREATORS

// TODO: change num players to be modifiable
const NUM_PLAYERS = 4

export function initializePlayerHand(playerHandArr) {
  return function thunk(dispatch) {  
    // send playerhands to firebase
    
    // store playerHands to store state
    dispatch(initializePlayerHand(playerHandArr))
  }
}

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
  case INIT_PLAYER_HAND:
    return action.playerHands

  default:
    return state
  }
}
