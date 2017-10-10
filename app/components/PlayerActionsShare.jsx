import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Label } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsShare extends Component {
  state = {
    modalOpen: false,
    cardToTake: '',
    traderToReceive: {}
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  // give a card
  // take a card
  // remove or add to other player 
  // confirm

  setCardToTake = (e, card) => {
    e.preventDefault()
    this.setState({ cardToTake: card })
  }

  setCardToTake = (e, trader) => {
    e.preventDefault()
    this.setState({ traderToReceive: trader })
  }

  displayCardsForTrade = () => {
    const traders = this.props.traders
    const activePlayer = this.props.activePlayer
    if (traders.length) {
      let colPortion = ''
      if (traders.length === 1) colPortion = 'sixteen'
      if (traders.length === 2) colPortion = 'eight'
      if (traders.length === 3) colPortion = 'five'

      return (
        <div className="ui grid">
          <Header color="grey">Cards you can give away</Header>
          {/* current player cards displayed to give away */}
          <div className={`eight wide column`} key=''>
            <Header color="grey">{activePlayer.name}</Header>
            {
              activePlayer.hand.length && activePlayer.hand.map((card) => {
                if (card.city) {
                  const cityName = card.city
                  return (
                    <div>
                      <Button size="small" onClick={(e) => this.setCardToTake(e, card)} color={card.props.color} ></Button>
                      <span>{cityName}</span>
                    </div>
                  )
                }
              })
            }
          </div>
          <div className={`eight wide column`} key=''>
            <Header color="grey">Give to ...</Header>
            {
              traders.length && traders.map((trader) => {
                return (
                  <div>
                    <Button size="small" onClick={(e) => this.setTraderToReceive(e, trader)} >{trader.name}</Button>
                  </div>
                )
              })
            }
          </div>
          <Header color="grey">Cards you take</Header>
          {
            traders.map((player) => {
              return (
                <div className={`${colPortion} wide column`} key={player}>
                  <Header color="grey">{player.name}</Header>
                  {
                    player.hand.length && player.hand.map((card) => {
                      if (card.city) {
                        const cityName = card.city
                        return (
                          <div>
                            <Button size="small" onClick={(e) => this.setCardToTake(e, card)} color={card.props.color} ></Button>
                            <span>{cityName}</span>
                          </div>
                        )
                      }
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
        <Header color={this.state.color} content={`Which card are we sharing?`} />
        {this.state.cardToTake.city && <Header color={this.state.cardToTake.props.color} content={`${this.state.cardToTake.city}`} />}
        <Modal.Content>
          {this.displayCardsForTrade()}
        </Modal.Content>
        <Modal.Actions>
          <Button size="small" onClick={this.tradeKnowledge} disabled={!this.state.cardToTake.city} >Confirm</Button>
          <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
