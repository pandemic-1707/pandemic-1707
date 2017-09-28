import axios from 'axios'
import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'
import utils from '../utils/playerDeck-utils.js'
import fire from '../../fire'
import { initPlayerHands } from './players.js'

let database = fire.database()

// ACTION TYPES

const SET_PLAYER_DECK = 'SET_PLAYER_DECK'

// ACTION CREATORS

export function initPlayerDeck(newDeck) {
  const action = { type: SET_PLAYER_DECK, newDeck }
  return action
}

// THUNK CREATORS
export function initialShufflePlayerDeck() {
  // shuffle deck
  const shuffledPlayerDeck = utils.initShufflePlayerDeck()
  // send deck to firebase
  return function thunk(dispatch) {
    debugger
    console.log("thunk")
    try {
      return database.ref('rooms/room1').set({
        playerDeck: shuffledPlayerDeck
      })
        .then(() => {
          // set playerDeck on store state
          const action = initPlayerDeck(shuffledPlayerDeck)
          dispatch(action)
        }).catch((err) => (console.error(err)))
    } catch (err) {
      console.error(err)
    }
  }

  // send
  // deal to players
  // separate & add epidemic cards
  // shuffle deck
}

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
    case SET_PLAYER_DECK:
      return action.newDeck

    default:
      return state
  }
}
