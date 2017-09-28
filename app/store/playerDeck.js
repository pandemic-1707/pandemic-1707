import axios from 'axios'
// import socket from '../socket'
import allCities from '../all-cities.js'
import allEvents from '../all-events.js'
import {firebase} from '../../fire/index.js'

// import {}

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

function initializePlayerDeck(numPlayers) {
  // randomize deck
  // turn objects into arrays
  const allCitiesArr = Object.keys(allCities).map((cityName) => {
    return {city: cityName, props: allCities[cityName]}
  })
  // TODO: more efficient way to sort objects array?
  let playerDeck = allCitiesArr.concat(allEvents)
  shuffle(playerDeck)
  console.log("before",playerDeck)
  // pick playerhands and remove cards from deck
  let numPlayerDrawnCards = 0
  // game specifies specific num of cards per player depending on
  // num of players
  if (numPlayers === 2) numPlayerDrawnCards = 4
  if (numPlayers === 3) numPlayerDrawnCards = 3
  if (numPlayers === 4) numPlayerDrawnCards = 2
  let playerHands = [] //all player hands
  for (let i = 0; i < numPlayers; i++) {
    let playerHand = [] //individual player hand
    for (let j = 0; j < numPlayerDrawnCards; j++) {
      playerHand.push(playerDeck.pop())
    }
    playerHands.push(playerHand)
  }
  // send playerhands to store & firebase
  
  // randomize deck
  shuffle(playerDeck)
  // send deck to firebase
  console.log("after player",playerDeck)  
  return playerDeck
}

// REDUCER

export default function reducer(state = [], action) {
  switch (action.type) {
  case INIT_PLAYER_DECK:
    return initializePlayerDeck(action.numPlayers)

  default:
  return state
  }
}
