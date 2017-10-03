import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Welcome from './Welcome'
import Sidebar from './Sidebar'
import App from '../main'
import Room from './Room'
import Chat from './Chat/ChatBox'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <App>
          <Route exact path="/" component={Welcome} />
          <Route path="/rooms/:roomName" component={Room} />
          <Route path="/chat" component={Chat} />
        </App>
      </Router>
      </div>
    )
  }
}
