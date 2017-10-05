import React, { Component } from 'react'
import fire from '../../fire'

const playerOrder = {'player1': '#FF339F', 'player2': '#30CA8D', 'player3': '#FFA913', 'player4': '#A213FF'}

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      loading: true
    }
  }
  componentDidMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      this.setState({
        players: snapshot.val().players
      })
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 2000)
  }
  render() {
    if (this.state.loading) {
      return (
        <div className='my-nice-tab-container'>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
    // filter out numPlayers on players object
      const playersItemsArr = Object.values(this.state.players).filter(x => typeof x === 'object')
      console.log('playersItemArr', playersItemsArr)
      const players = playersItemsArr.map((playerItems, idx) => {
        console.log('playersItemArr', playersItemsArr[idx], 'idx', idx)
        return (
          <div key={idx}>
            <div>
              <div className="player-box">
                <div className={'player-name'}
                  style={{backgroundColor: playersItemsArr[idx].color.hexVal}}>
                  <img height="32" width="32" src={`/images/${playersItemsArr[idx].role}.png`} />
                  <div>
                    {playersItemsArr[idx].name}
                  <br />
                    {playersItemsArr[idx].role}
                  </div>
                </div>
                <div className="player-hand">
                {
                  playersItemsArr[idx].hand && playersItemsArr[idx].hand.map((obj, i) => {
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
}
