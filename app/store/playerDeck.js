import axios from 'axios'
import allCities from '../data/all-cities.js'
import allEvents from '../data/all-events.js'
import utils from '../utils/playerDeck-utils.js'
import {firebase} from '../../fire/index.js'
import {initPlayerHands} from './players.js'

let database = firebase.database()

// ACTION TYPES

const INIT_PLAYER_DECK = 'INIT_PLAYER_DECK'

// ACTION CREATORS

export function initPlayerDeck(numPlayers) {
  const action = { type: INIT_PLAYER_DECK, numPlayers }
  return action
}

// THUNK CREATORS
export function initialShufflePlayerDeck(numPlayers) {
  // shuffle deck
  const shuffledPlayerDeck = utils.initShufflePlayerDeck(numPlayers)
  // send deck to firebase
  return function thunk(dispatch) {
    return database.ref('rooms/room1').set({
      playerDeck: shuffledPlayerDeck
    })
  }

  // return function thunk(dispatch) {
  //   return axios.get('/api/channels')
  //     .then(res => res.data)
  //     .then(channels => {
  //       const action = getChannels(channels);
  //       dispatch(action);
  //     });
  // };

  // send
  // deal to players
  // separate & add epidemic cards
  // shuffle deck
}

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
  case INIT_PLAYER_DECK:
    return utils.initializePlayerDeck(action.numPlayers)

  default:
    return state
  }
}
