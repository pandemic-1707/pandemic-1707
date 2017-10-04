import React, { Component } from 'react'
import fire from '../../fire'

const playerOrder = {'player1': '#FF339F', 'player2': '#30CA8D', 'player3': '#FFA913', 'player4': '#A213FF'}

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      currPlayers: []
    }
  }
  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      this.setState({
        players: snapshot.val().players,
        currPlayers: snapshot.val().state.currPlayers
      })
    })
  }
  render() {
    const playersItemsArr = Object.values(this.state.players)
    console.log('playersItemArr', playersItemsArr)
    const players = playersItemsArr.map((idx) => {
      return (
        <div key={idx}>
          <div>
            <div className="player-box">
              <div className={'player-name'}
                style={{ backgroundColor: playersItemsArr[0].color.hexVal }}>
                <img height="32" width="32" src={`/images/${playersItemsArr[0].role}.png`} />
                <div>
                  {playersItemsArr[0].name}
                <br />
                  {playersItemsArr[0].role}
                </div>
              </div>
              <div className="player-hand">
              {
                playersItemsArr[0].hand && playersItemsArr[0].hand.map((obj, i) => {
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
