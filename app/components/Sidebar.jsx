import React, { Component } from 'react'
import fire from '../../fire'
import { Form, List, Transition } from 'semantic-ui-react'

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
    }, 1000)
  }
  render() {
    if (this.state.loading) {
      return (
        <div className='my-nice-tab-container'>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
      const playersItemsArr = Object.values(this.state.players)
      const players = playersItemsArr.map((playerItems, idx) => {
        const player = playersItemsArr[idx]
        const hexVal = player.color.hexVal
        const role = player.role
        const name = player.name
        const hand = player.hand
        return (
          <div key={idx}>
            <div>
              <div className="player-box">
                <div className={'player-name'}
                  style={player ? {backgroundColor: hexVal} : ''}>
                  <div className='player-role'>
                    <img className='avatar' height="32" width="32" src={`/images/${role}.png`} />
                      <div className='titles'>
                        <div className='user'>
                          {name}
                        </div>
                        <br />
                        <div className='role'>
                          {role}
                        </div>
                      </div>
                  </div>
                </div>
                <div className="player-hand">
                {
                  hand && hand.map((obj, i) => {
                    const color = obj.props ? obj.props.color : 'grey'
                    let title = obj.city || Object.keys(obj)[0]
                    title = title.split('-').join(' ')
                    return (
                    <Transition animation="flash" duration="1000" transitionOnMount={true} key={`color-box-${i}`}>
                      <List>
                        <List.Item>
                          <List.Icon className='color-box' style={{backgroundColor: color}}></List.Icon>
                          <List.Content key={`card-${i}`}>{title}</List.Content>
                        </List.Item>
                      </List>
                    </Transition>
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
