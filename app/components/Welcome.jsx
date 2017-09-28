import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import Modal from 'react-modal'
import fire from '../../fire'

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

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      roomName: 'one',
      playerNumber: 2,
      player1: '',
      player2: '',
      player3: '',
      player4: ''
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.saveRoomData = this.saveRoomData.bind(this)
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

  handleSubmit(e) {
    e.preventDefault()
    fire.database().ref('rooms/' + this.state.roomName).set({
      playerNumber: this.state.playerNumber,
      player1: this.state.player1,
      player2: this.state.player2,
      player3: this.state.player3,
      player4: this.state.player4
    })
    this.props.history.push(`/room/${this.state.roomName}`)
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }
  render() {
    return (
      <div>
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
              <label htmlFor="playerNumber">Number of Players</label>
              <select className="form-control"
              id="exampleSelect1"
              name="playerNumber"
              onChange={this.saveRoomData.bind(this, 'playerNumber')}
              >
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Invite your friends!</label>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player1"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Name"
                onChange={this.saveRoomData.bind(this, 'player1')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player2"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Name"
                onChange={this.saveRoomData.bind(this, 'player2')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player3"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Name"
                onChange={this.saveRoomData.bind(this, 'player3')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input name="player4"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Name"
                onChange={this.saveRoomData.bind(this, 'player4')}
                />
                <input type="text" className="form-control"
                id="inlineFormInputGroup" placeholder="Email" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          </Modal>
          <br />
          <button className="btn btn-outline-success">Rules</button>
        </div>
      </div>
    )
  }
}

// const mapState = null
// const mapDispatch = null

// export default connect(mapState, mapDispatch)(Home)
