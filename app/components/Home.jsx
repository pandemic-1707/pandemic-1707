import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initPlayerDeck } from '../store/playerDeck.js'

export class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // TODO: change num players to be modifiable
    const NUM_PLAYERS = 4
	this.props.initializeGame(NUM_PLAYERS)

    return (
      <div class="title">
        <h1 id="gametitle">Pandemic</h1>
      </div>
    )
  }
}

const mapState = null
const mapDispatchToProps = function(dispatch) {
  return {
    initializeGame: function(numPlayers) {
	  dispatch(initPlayerDeck(numPlayers))
    }
  }
}

export default connect(mapState, mapDispatchToProps)(Home)
// export default connect(mapDispatchToProps)(Home)
