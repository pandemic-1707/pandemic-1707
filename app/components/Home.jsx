import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initPlayerDeck } from '../store/playerDeck.js'

export class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // TODO: change num players to be modifiable
    const NUM_PLAYERS = 4
  	this.props.initializeGame(NUM_PLAYERS)
  }

  render() {
    const { playerDeck } = this.props
    console.log("RENDER",playerDeck)
    return (
      <div class="title">
        <h1 id="gametitle">Pandemic</h1>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    playerDeck: state.playerDeck
  }
}
const mapDispatchToProps = function(dispatch) {
  return {
    initializeGame: function(numPlayers) {
	    dispatch(initPlayerDeck(numPlayers))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
