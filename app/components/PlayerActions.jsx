import React, { Component } from 'react'
import fire from '../../fire'
import Modal from 'react-modal'

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
      modalIsOpen: false
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

  handleMoveAction = () => {
    // create popup
    if (this.state.modalIsOpen) this.setState({modalIsOpen: false})
    else this.setState({modalIsOpen: true})
  }

  render() {
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

    return (
      <div>
        {/* move action modal */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <h1>HERES A MODAL</h1>
        </Modal>
        <div className="container-fluid player-actions-panel">
          <div className="row">
            <div className="col-sm-2 player-action text-center" onClick={this.handleMoveAction}>
              <span>Move</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Treat</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Cure</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Build</span>
            </div>
            <div className="col-sm-2 player-action text-center">
              <span>Share</span>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-sm-12 text-center">
              Actions Left: {}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
