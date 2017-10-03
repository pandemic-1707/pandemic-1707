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
      return (
        <div key={idx}>
          <div>
            <div className="player-box">
              <div className="player-name" style={{ backgroundColor: player.color.hexVal }}>
                <img height="32" width="32" src={`/images/${player.role}.png`} />
                <div>
                  {player.name}
                <br />
                  {player.role}
                </div>
              </div>
              <div className="player-hand">
              {
                this.state.players['player1'].hand && this.state.players[`player${idx+1}`].hand.map((obj, i) => {
                  return (
                      <li key={i}>{obj.city || Object.keys(obj)[0]}</li>
                  )
                })
              }
              </div>
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
