import React, {Component} from 'react'
import {connect} from 'react-redux'
import firebase from '../../fire'

export default class Room extends Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {

	}
	render() {
		return(
			<div>
				<div id="player-sidebar">
					<h3 id="player-name">Player 1</h3>
					<h3>Player 2</h3>
				</div>
			</div>
		)
	}
}