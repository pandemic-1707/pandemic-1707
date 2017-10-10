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
  handleOpen = () => this.setState({ alertOpen: true })

  handleClose = () => this.setState({ alertOpen: false })

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Cure</Button>}
        open={this.state.alertOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='fire extinguisher' content="Yay you've cured the disease!" />
        <Modal.Content>
          <h3>Woot!</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> Awesome
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
