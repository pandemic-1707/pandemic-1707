import React, { Component } from 'react'
import fire from '../../fire'

const playerOrder = {'player1': '#FF339F', 'player2': '#30CA8D', 'player3': '#FFA913', 'player4': '#A213FF'}

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {}
    }
  }
  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/players`).on('value', snapshot => {
      this.setState({
        players: snapshot.val()
      })
    })
  }
  render() {
    const players = Object.values(this.state.players).map((player, idx) => {
      const playerOrder = {'player1': '#FF339F', 'player2': '#30CA8D', 'player3': '#FFA913', 'player4': '#A213FF'}
      var color = playerOrder[`player${idx+1}`]
      return (
        <div key={idx}>
          <div>
            <div className="player-box">
              <div className="player-name" style={{backgroundColor: color}}>
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
