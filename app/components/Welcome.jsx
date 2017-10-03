import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'
import fire from '../../fire'
import shuffle from 'shuffle-array'
import WhoAmI from './WhoAmI'
import {filteredObj} from '../utils/welcome-utils'

// Get the auth API from Firebase.
const auth = fire.auth()

// Ensure that we have (almost) always have a user ID, by creating
// an anonymous user if nobody is signed in.
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

const playerOrder = {'player1': '#FF339F', 'player2': '#30CA8D', 'player3': '#FFA913', 'player4': '#A213FF'}

function validate(name1, name2) {
  return {
    name1: name1.length === 0,
    name2: name2.length === 0
  }
}

export default class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      roomName: 'one',
      numPlayers: 2,
      players: {
        player1: {
          name: ''
        },
        player2: {
          name: ''
        },
        player3: {
          name: ''
        },
        player4: {
          name: ''
        }
      },
      touched: {
        name1: false,
        name2: false,
        name3: false,
        name4: false
      }
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.saveRoomData = this.saveRoomData.bind(this)
    this.savePlayerName = this.savePlayerName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  openModal() {
    this.setState({modalIsOpen: true})
  }

  saveRoomData(field, e) {
    var change = {}
    change[field] = e.target.value
    this.setState(change)
  }

  savePlayerName(field, e) {
    const players = Object.assign({}, this.state.players)
    players[field].name = e.target.value
    this.setState({players})
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: {...this.state.touched, [field]: true}
    })
  }
  canBeSubmitted() {
    const errors = validate(this.state.players['player1']['name'], this.state.players['player2']['name'])
    const isDisabled = Object.keys(errors).some(x => errors[x])
    return isDisabled
  }
  handleSubmit(e) {
    e.preventDefault()
    let {roomName, numPlayers} = this.state
    let {players} = this.state
    // only write non-blank player name to DB
    players = filteredObj(players)
    numPlayers = parseInt(numPlayers)
    // write player name to firebase
    fire.database().ref(`rooms/${roomName}`).set({numPlayers, players})
    const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
    var shuffled = shuffle(roles)
    // randomly assign role and write to firebase
    Object.keys(players).map(player => {
      var playerNum = player.slice(-1)
      fire.database().ref(`/rooms/${roomName}/players/${player}`).update({
        role: shuffled[playerNum]
      })
    })
    this.props.history.push(`/rooms/${this.state.roomName}`)
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    const name1 = this.state.players.player1.name
    const name2 = this.state.players.player2.name
    const name3 = this.state.players.player3.name
    const name4 = this.state.players.player4.name
    const errors = validate(name1, name2)
    const isDisabled = Object.keys(errors).some(x => errors[x])

    const shouldMarkError = (field) => {
      const hasError = errors[field]
      const shouldShow = this.state.touched[field]
      return hasError ? shouldShow : false
    }
    return (
      <div className="welcome">
        <WhoAmI auth={auth}/>
        <div id="title">
          <h1 id="gametitle">PLANETAMIC</h1><br />
          <h2> A Game by Emily EastLake, An Le, Mary Yen </h2>
          <br />
          <button type="button"
          className="btn btn-outline-primary"
          onClick={this.openModal}>New Game</button>
          <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          >
          <form onSubmit={this.handleSubmit}>
            <button type="button"
            className="close"
            aria-label="Close"
            onClick={this.closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Room Name</label>
              <input name="roomName"
              className="form-control"
              id="name"
              aria-describedby="emailHelp"
              placeholder="Enter Your Room Name"
              onChange={this.saveRoomData.bind(this, 'roomName')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numPlayers">Number of Players</label>
              <select className="form-control"
              id="exampleSelect1"
              name="numPlayers"
              onChange={this.saveRoomData.bind(this, 'numPlayers')}
              >
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Invite your friends!</label>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="name1"
                className={shouldMarkError('name1') ? 'error form-control' : 'form-control'}
                id="inlineFormInputGroup"
                placeholder="Player 1 Name"
                onChange={this.savePlayerName.bind(this, 'player1')}
                onBlur={this.handleBlur('name1')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="name2"
                className={shouldMarkError('name2') ? 'error form-control' : 'form-control'}
                id="inlineFormInputGroup"
                placeholder="Player 2 Name"
                onChange={this.savePlayerName.bind(this, 'player2')}
                onBlur={this.handleBlur('name2')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player3"
                className='form-control'
                id="inlineFormInputGroup"
                placeholder="Player 3 Name"
                onChange={this.savePlayerName.bind(this, 'player3')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player4"
                className='form-control'
                id="inlineFormInputGroup"
                placeholder="Player 4 Name"
                onChange={this.savePlayerName.bind(this, 'player4')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
            </div>
            <button
            type="submit"
            className='btn'
            disabled={isDisabled}
            >
            Submit</button>
          </form>
          </Modal>
          <br />
          <button className="btn btn-outline-success">Rules</button>
        </div>
      </div>
    )
  }
}
