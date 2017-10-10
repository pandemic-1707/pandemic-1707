import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsShare extends Component {
  state = {
    modalOpen: false,
    cardToTrade: {}
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  // give a card
  // take a card
  // remove or add to other player 
  // confirm

  displayCardsForTrade = () => {
    const traders = this.props.traders
    if (traders.length) {
      let colPortion = ''
      if (traders.length === 1) colPortion = 'sixteen'
      if (traders.length === 2) colPortion = 'eight'
      if (traders.length === 3) colPortion = 'five'
      if (traders.length === 4) colPortion = 'four'

      return (
        <div className="ui grid">
          {
            traders.map((player) => {
              return (
                <div className={`${colPortion} wide column`} key={player}>
                  <Header>{player.name}</Header>
                  {
                    player.hand.length && player.hand.map((card) => {
                      const cityName = card.city
                      return <div key={cityName} value={cityName}>{cityName}</div>
                    })
                  }
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  render() {
    return (
      <Modal
        trigger={<Button size="small" onClick={this.handleOpen} color="olive" disabled={this.props.traders.length < 1}>Share</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header color={this.state.color} content={`Which card are we moving?`} />
        <Modal.Content>
          {this.displayCardsForTrade()}
        </Modal.Content>
        <Modal.Actions>
          <Button size="small" onClick={this.cureDisease} disabled={!this.state.cardToTrade.city} >Confirm</Button>
          <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
