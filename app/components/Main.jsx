import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Welcome from './Welcome'
import Sidebar from './Sidebar'
import Room from './Room'
import Wait from './Wait'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/rooms/wait/:roomName" component={Wait} />
          <Route exact path="/rooms/:roomName" component={Room} />
        </Switch>
      </Router>
      </div>
    )
  }
}
