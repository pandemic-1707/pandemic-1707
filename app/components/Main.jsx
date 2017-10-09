import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Welcome from './Welcome'
import Room from './Room'
import EnterRoom from './EnterRoom'
import Wait from './Wait'
import Login from './Login'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/rooms/wait/:roomName" component={Wait} />
          <Route exact path="/rooms/:roomName" component={Room} />
          <Route exact path="/rooms/enter" component={EnterRoom} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
      </div>
    )
  }
}
