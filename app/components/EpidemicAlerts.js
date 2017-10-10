import React, {Component} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import fire from '../../fire'
const db = fire.database()
export default class Alerts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertOpen: false,
      numActions: 0
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleOpen = () => this.setState({ alertOpen: true })

  handleClose = () => this.setState({ alertOpen: false })

  componentDidMount() {
    db.ref(`/rooms/${this.props.roomName}/players/${this.props.currPlayer}/hand`).on('value', dataSnap => {
        // when there is an epidemic card on hand
      if (dataSnap.val().map(card => card.hasOwnProperty('Epidemic')).includes(true)) {
        this.setState({
          alertOpen: true
        })
      }
    })
  }
  render() {
    return (
      <Modal
        open={this.state.alertOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='fire' content="Uh oh there's an epidemic!" />
        <Modal.Content>
          <h3>Womp!</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> Ugh
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
