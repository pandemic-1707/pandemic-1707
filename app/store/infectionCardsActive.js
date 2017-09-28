import infectionDeck from '../data/infection-deck'
import shuffle from '../utils/deck-utils'

// actions
const INIT_INFECTION_DECK = 'INIT_INFECTION_DECK'

// action creator
export function initInfectionDeck(deck) {
  return {type: INIT_INFECTION_DECK, deck: deck}
}

function infectionDeckActiveReducer(state = [], action) {
  switch (action.type) {
  case INIT_INFECTION_DECK: {
    return shuffle(infectionDeck)
  }
  default: {
    return state
  }
  }
}

export default infectionDeckActiveReducer
