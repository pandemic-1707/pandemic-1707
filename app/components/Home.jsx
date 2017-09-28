import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initialShufflePlayerDeck } from '../store/playerDeck.js'

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
    const { playerDeck, players } = this.props
    console.log("render deck", playerDeck)
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
    players: state.players
  }
}
const mapDispatchToProps = function(dispatch) {
  return {
    initializeGame: function(numPlayers) {
      dispatch(initialShufflePlayerDeck())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
