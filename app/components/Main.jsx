import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Welcome from './Welcome'
import Sidebar from './Sidebar'
import App from '../main'
import GameMap from './GameMap'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <App>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/map" component={GameMap} />
          <Route path="/rooms/:roomName" component={Sidebar} />
        </App>
      </Router>
      </div>
    )
  }
}
