import axios from 'axios'
// import socket from '../socket'
import allCities from '../all-cities.js'
import allEvents from '../all-events.js'
import {firebase} from '../../fire/index.js'

// ACTION TYPES

const INIT_PLAYER_DECK = 'INIT_PLAYER_DECK'

// ACTION CREATORS

export function initPlayerDeck(numPlayers) {
  const action = { type: INIT_PLAYER_DECK, numPlayers }
  return action
}

// THUNK CREATORS
// referenced from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = (a) => {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
}

// TODO: change num players to be modifiable
const NUM_PLAYERS = 4

export function initializePlayerDeck() {
  return function thunk(dispatch) {
    // get num players
    // randomize deck
    let playerDeck = shuffle(allCities.concat(allEvents))
    console.log("PLAYERDECK", playerDeck)
    // pick playerhands
    let playerHand
    for (let i = 0; i < NUM_PLAYERS; i++) {
        playerDeck.pop()
    }
    // send playerhands to firebase
    // randomize deck
    // send deck to firebase
  // return axios.get('/api/messages')
  //   .then(res => res.data)
  //   .then(messages => {
  //   const action = initPlayerDeck(numPlayers)
  //   dispatch(action)
  //   })
  }
}

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
  case INIT_PLAYER_DECK:
  return action.messages

  default:
  return state
  }
}
