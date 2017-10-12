import React, {Component} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import fire from '../../fire'
const db = fire.database()
export default class Alerts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertOpen: false
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  componentDidMount() {
    db.ref(`/rooms/${this.props.roomName}/state/outbreaks`).on('value', dataSnap => {
    // if outbreak level reached 8
      if (dataSnap.val() && dataSnap.val() === 8) {
        this.setState({
          alertOpen: true
        })
      }
    })
  }
  handleOpen = () => this.setState({ alertOpen: true })

  handleClose = () => this.setState({ alertOpen: false })

  render() {
    return (
      <Modal
        open={this.state.alertOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='frown' content="The Disease Has Taken Over The World!" />
        <Modal.Content>
          <h3>Game Over!</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='thumbs down' /> Ok
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
