import React, {Component} from 'react'
import {connect} from 'react-redux'
import fire from '../../fire'
import {shuffleArray} from '../utils/sidebar-utils'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {}
    }
  }
  componentDidMount() {
    const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
    const playerOrder = ['player1', 'player2', 'player3', 'player4']
    var shuffled = shuffleArray(roles)
    // randomly assign role and write to firebase
    playerOrder.map(player => {
      var playerNum = player.slice(-1)
      fire.database().ref(`/rooms/${this.props.match.params.roomName}/players/${player}`).update({
        role: shuffled[playerNum]
      })
    })
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).on('value', snapshot => {
      this.setState({
        players: snapshot.val()
      })
    })
  }
  render() {
    const players = Object.values(this.state.players).map(player => {
      return (
        <div key={player.name}>
          <div id="player-sidebar">
            <div className="player-box">
              <div className="player-name">
                <img height="32" width="32" src={`/${player.role}.png`} />
                <div>
                  {player.name}
                <br />
                  {player.role}
                </div>
              </div>
              <div className="player-hand">Hand</div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className="column">{players}</div>
    )
  }
}
