import cities from '../data/all-cities'

// actions
const INFECT_INITIAL_CITIES = 'INFECT_INITIAL_CITIES'

// action creator
export function infectInitialCities(deck) {
  return {type: INFECT_INITIAL_CITIES, deck: deck}
}

function citiesReducer(state = cities, action) {
  switch (action.type) {
  case INFECT_INITIAL_CITIES: {
    const deck = action.deck
    const copy = 
    for (let infectionRate = 1; infectionRate <= 3; infectionRate++) {
      for (let nthCity = 0; nthCity <= 2; nthCity++) {

      }
    }
    return 
  }
  default: {
    return state
  }
  }
}

export default citiesReducer
