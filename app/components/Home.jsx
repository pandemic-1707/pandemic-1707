import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initializePlayerDeck } from '../store/playerCards.js'

export default class Home extends Component {
	constructor(props) {
		super(props)
	}
	render() {

		console.log("REACHED")
		initializePlayerDeck()()


		return (
			<div class="title">
				<h1 id="gametitle">Pandemic</h1>
			</div>
		)
	}
}

// const mapState = null
// const mapDispatch = null

// export default connect(mapState, mapDispatch)(Home)