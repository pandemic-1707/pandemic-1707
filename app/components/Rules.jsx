import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default class Rules extends Component {
  state = { modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Rules</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='Rules' />
        <Modal.Content>
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
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
