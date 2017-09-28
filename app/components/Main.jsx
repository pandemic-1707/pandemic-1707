import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './Home'
import Room from './Room'
import App from '../main'

export default class Main extends Component {
	render() {
		return (
			<div>
			<Router>
		    <App>
		      <Route exact path="/" component={Home} />
		      <Route path="/room/:roomName" component={Room} />
		    </App>
		  </Router>
		  </div>
  	)
	}
}