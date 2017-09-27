import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'

export default class Home extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return(
			<div>
				<div id="title">
					<h1 id="gametitle">PLANETAMIC</h1><br />
					<h2> A Game by Emily EastLake, An Le, Mary Yen</h2>
					<br/>
					<NavLink to="/room">
					<button type="button" className="btn btn-outline-primary">New Game</button>
					</NavLink>
					<br/>
					<button type="button" className="btn btn-outline-success">Rules</button>
				</div>
			</div>
		)
	}
}

// const mapState = null
// const mapDispatch = null

// export default connect(mapState, mapDispatch)(Home)