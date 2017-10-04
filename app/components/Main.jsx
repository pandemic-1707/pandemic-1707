import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Welcome from './Welcome'
import Sidebar from './Sidebar'
import Room from './Room'
import Chat from './Chat/ChatBox'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/rooms/:roomName" component={Room} />
          <Route path="/chat" component={Chat} />
        </Switch>
      </Router>
      </div>
    )
  }
}
