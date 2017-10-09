import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react'
import { filteredObj, setCurrPlayers } from '../utils/welcome-utils'
import fire from '../../fire'
import shuffle from 'shuffle-array'

const auth = fire.auth()
const NUM_STARTING_ACTIONS = 4

function validate(name1, name2) {
  return {
    name1: name1.length === 0,
    name2: name2.length === 0
  }
}

const options = [
  { key: '2', text: '2', value: '2' },
  { key: '3', text: '3', value: '3' },
  { key: '4', text: '4', value: '4' }
]

class EnterRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.saveRoomData = this.saveRoomData.bind(this)
    this.savePlayerName = this.savePlayerName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleOpen = () => {
    if (this.state.userId) {
      this.setState({modalOpen: true})
    } else {
      alert('Please Login To Create A Room!')
    }
  }

  handleClose = () => this.setState({ modalOpen: false })

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
        <input 
        key={`inputField${i}`}
        placeholder={`Email${i}`} 
        onChange={this.savePlayerName.bind(this, `player${i}`)}
        onBlur={this.handleBlur(`name${i}`)}
        />
      )
    }
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen} color="teal">New Game</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
      <Header icon='wordpress forms' content='Invite your friends!' />
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Room Name</label>
            <input placeholder='Room Name' 
            onChange={this.saveRoomData.bind(this, 'roomName')}
            />
          </Form.Field>
          <Form.Select label='Number of Players' options={options} placeholder='Number of Players' />
          <Form.Field> {inputFields} </Form.Field>
          <Button color='green' onClick={this.handleSubmit} inverted>
            <Icon name='checkmark' /> Submit
          </Button>
        </Form>
      </Modal.Content>
      </Modal>
    )
  }
}
export default withRouter(EnterRoom)