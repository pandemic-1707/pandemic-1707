import React, { Component } from 'react'
import WhoAmI from './WhoAmI'
import { filteredObj, setCurrPlayers } from '../utils/welcome-utils'
import Rules from './Rules'
import { NavLink } from 'react-router-dom'
import Modal from 'react-modal'
import fire from '../../fire'
import shuffle from 'shuffle-array'

const auth = fire.auth()
const NUM_STARTING_ACTIONS = 4

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
      rulesOpen: false,
      roomName: 'one',
      numPlayers: 2,
      userId: '',
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
        name2: false
      }
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.saveRoomData = this.saveRoomData.bind(this)
    this.savePlayerName = this.savePlayerName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.openRules = this.openRules.bind(this)
    this.closeRules = this.closeRules.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          userId: user.uid
        })
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }

  openModal() {
    if (this.state.userId) {
      this.setState({modalIsOpen: true})
    } else {
      alert('Please Login To Create A Room!')
    }
  }

  openRules() {
    this.setState({rulesOpen: true})
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
    const { roomName } = this.state
    let { players, numPlayers } = this.state
    // only write non-blank player name to DB
    players = filteredObj(players)
    numPlayers = parseInt(numPlayers)
    // write numbers of players to firebase
    fire.database().ref(`rooms/${roomName}`).set({
      numPlayers: numPlayers
    })
    this.props.history.push(`/rooms/wait/${this.state.roomName}`)
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  closeRules() {
    this.setState({rulesOpen: false})
  }

  render() {
    const name1 = this.state.players.player1.name
    const name2 = this.state.players.player2.name
    const errors = validate(name1, name2)
    const isDisabled = Object.keys(errors).some(x => errors[x])

    const shouldMarkError = (field) => {
      const hasError = errors[field]
      const shouldShow = this.state.touched[field]
      return hasError ? shouldShow : false
    }

    const inputFields = []
    for (let i = 1; i <= this.state.numPlayers; i++) {
      inputFields.push(
        <div key={`inputField${i}`}className="input-group mb-2 mr-sm-2 mb-sm-0">
          <input name={`name${i}`}
          className={shouldMarkError(`name${i}`) ? 'error form-control' : 'form-control'}
          id="inlineFormInputGroup"
          placeholder={`Player ${i} Name`}
          onChange={this.savePlayerName.bind(this, `player${i}`)}
          onBlur={this.handleBlur(`name${i}`)}
          />
          <input type="text" className="form-control"
          id="inlineFormInputGroup" placeholder="Email" />
        </div>
      )
    }

    return (
      <div className="welcome">
        <WhoAmI auth={auth} history={this.props.history} />
        <div id="title">
          <h1 id="gametitle">PLANETAMIC</h1><br />
          <h2 id="gamecredit"> A Game by Emily Eastlake, An Le and Mary Yen </h2>
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
              { inputFields }
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
          <button className="btn btn-outline-success" onClick={this.openRules}>Rules</button>
          <Modal
          isOpen={this.state.rulesOpen}
          onRequestClose={this.closeRules}
          style={customStyles}
          contentLabel="Example Modal"
          >
            <button type="button"
              className="close"
              aria-label="Close"
              onClick={this.closeRules}
              >
              <span aria-hidden="true">&times;</span>
            </button>
            <div>
              <h3>In this game, you can't lose (at least not yet).</h3>
              <h4>The question is: how quickly can you eradicate the disease?</h4>
              <h3>How to Play:</h3>
              <p> Work together as a team to cure a deadly pandemic as quickly as possible as it spreads across the world map. </p>
              <p> The board will show you the initial infection levels in each city (3 being the highest and 1 being the lowest). </p>
              <p> On your turn, you may take up to four actions to fight for your survival.
              Options include: 1) moving to an adjacent city, 2) discarding a card to move to the named city,
              3) discarding a card matching your current city to move to any city or 4) removing one disease cube from your current city. </p>
              <p> After your four actions, you will draw a card from the player deck. Most of these are city cards,
              but some are Special Event cards which cannot be played at this time. </p>
              <p> If you draw an Epidemic card, we will draw the bottom card of the infection deck and place three cubes in that city,
              causing an outbreak if necessary. (If a fourth disease cube would ever be added to a city, that city suffers an outbreak,
              spreading cubes to all adjacent cities.) </p>
              <p> When you remove all the infection from the board, you have won! </p>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}
