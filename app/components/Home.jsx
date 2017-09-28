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
    const { playerDeck, playerHands } = this.props
    console.log("render hands", playerHands)
    return (
      <div class="title">
        <h1 id="gametitle">Pandemic</h1>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    playerDeck: state.playerDeck,
    playerHands: state.playerHands
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
