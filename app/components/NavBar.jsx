import React, { Component } from 'react'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import Rules from './Rules'
import { Menu } from 'semantic-ui-react'
// Get the auth API from Firebase.
const auth = fire.auth()

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      red: 24,
      yellow: 24,
      black: 24,
      blue: 24,
      infectionIdx: 0,
      outbreaks: 0,
      researchCenter: 1,
      currPlayer: '',
      players: {},
      loading: true
    }
  }
  componentDidMount() {
    fire.database().ref(`/rooms/${this.props.roomName}`).on('value', snapshot => {
      const currPlayer = snapshot.val().state.currPlayer
      const players = snapshot.val().players
      this.setState({
        currPlayer: snapshot.val().state.currPlayer,
        players: snapshot.val().players
      })
      if (players && currPlayer) {
        const hand = players[currPlayer].hand
        if (players[currPlayer].numActions === 0) {
          // change numActions back to 4
          return fire.database().ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
            numActions: 4
          })
          // push those 2 onto player's hand
          .then(() => {
            fire.database().ref(`/rooms/${this.props.roomName}/players/${currPlayer}`).update({
              hand: [...hand, snapshot.val().playerDeck.shift()]
            })
          })
          // pull those 2 out of player deck
          .then(() => {
            const updatedPlayerDeck = snapshot.val().playerDeck.slice(1)
            fire.database().ref(`/rooms/${this.props.roomName}`).update({
              playerDeck: updatedPlayerDeck
            })
          })
          // update to the next currPlayer
          .then(() => {
            const currPlayersArr = snapshot.val().state.currPlayersArr
            const i = ((currPlayersArr.indexOf(currPlayer) + 1) % currPlayersArr.length)
            console.log('i', i)
            fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
              currPlayer: currPlayersArr[i]
            })
            this.setState({
              currPlayer: currPlayersArr[i]
            })
          })
        }
      }
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }
  componentWillMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
      red: this.state.red,
      yellow: this.state.yellow,
      black: this.state.black,
      blue: this.state.blue,
      infectionIdx: this.state.infectionIdx,
      outbreaks: this.state.outbreaks,
      researchCenter: this.state.researchCenter
    })
  }
  render() {
    const { players, currPlayer } = this.state
    let currPlayerName = ''
    if (currPlayer) {
      currPlayerName = players[currPlayer].name
    }
    if (this.state.loading) {
      return (
        <div>
          <div className='loading-state'>Loading...</div>
        </div>
      )
    } else {
      return (
        <Menu inverted>
        <Menu.Item>
          <img src={'/images/redIcon.png'} />
          {this.state.red}
          <img src={'/images/blackIcon.png'} />
          {this.state.black}
          <img src={'/images/blueIcon.png'} />
          {this.state.blue}
          <img src={'/images/yellowIcon.png'} />
          {this.state.yellow}
          <img src={'/images/infectionMarker.jpg'} />
          {this.state.infection}
          <img src={'/images/OutbreakMarker.png'} />
          {this.state.outbreaks}
          <img src={'/images/researchCenter.png'} />
          {this.state.researchCenter}
        </Menu.Item>

        <Menu.Item>
          Current Turn: {currPlayerName}
        </Menu.Item>

        <Menu.Item>
         <Rules />
        </Menu.Item>

        <Menu.Item>
          <WhoAmI auth={auth}/>
        </Menu.Item>
      </Menu>
      )
    }
  }
}
