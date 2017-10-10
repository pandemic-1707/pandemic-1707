import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Label } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsShare extends Component {
  state = {
    modalOpen: false,
    cardToTake: '',
    traderToReceive: {},
    give: true
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

  // //////// give cards ////////
  displayCardsToGive = (traders, activePlayer) => {
    return (
      <div className="ui grid">
        <div>
          <div className={`four wide column`} key='ptogive'>
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
          <div className={`four wide column`} key='ptoreceive'>
            <Header color="grey">Give to ...</Header>
            {
              traders.length && traders.map((trader) => {
                console.log("TRADER to take", trader)
                return (
                  <div>
                    <Button size="small" onClick={(e) => this.setTraderToReceive(e, trader)} >{trader.name}</Button>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  // //////// take cards ////////
  displayCardsToTake = (traders) => {
    if (traders.length) {
      let colPortion = ''
      if (traders.length === 1) colPortion = 'sixteen'
      if (traders.length === 2) colPortion = 'eight'
      if (traders.length === 3) colPortion = 'five'
      return (
        <div className="ui grid">
          <Header color={this.state.color} content={`Which card are you taking?`} />
          {this.state.cardToTake.city && <Header color={this.state.cardToTake.props.color} content={`${this.state.cardToTake.city}`} />}
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

  toggleGive = () => {
    this.setState({
      give: !this.state.give
    })
  }

  displayCardsForTrade = () => {
    const traders = this.props.traders
    const activePlayer = this.props.activePlayer
    if (activePlayer.hand && activePlayer.hand.length) {
      return (
        <div>
          {
            this.state.give ? this.displayCardsToGive(traders, activePlayer) : this.displayCardsToTake(traders)
          }
        </div >
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
        <Modal.Content>
          <span>
            <Header color='grey' content={`Sharing Knowledge`} />
            <Button.Group>
              <Button onClick={this.toggleGive}>Give</Button>
              <Button.Or />
              <Button positive onClick={this.toggleGive}>Take</Button>
            </Button.Group>
          </span>
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
