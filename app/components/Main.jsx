import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Welcome from './Welcome'
import Sidebar from './Sidebar'
import App from '../main'

export default class Main extends Component {
  render() {
    return (
      <div>
      <Router>
        <App>
          <Route exact path="/" component={Welcome} />
          <Route path="/room/:roomName" component={Sidebar} />
        </App>
      </Router>
      </div>
    )
  }
}
