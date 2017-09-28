import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

/**
 * Each module exports its own sub-reducer by default.
 * We're giving them the same name as the field we want on state,
 * so that we can cleverly use the shorthand notation in the object we
 * send to combineReducers
 */
import playerDeck from './playerDeck'
import players from './players'

const reducer = combineReducers({
  playerDeck,
  players
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    createLogger()
  ))
)

export default store
