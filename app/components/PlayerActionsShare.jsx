import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Label, Grid, Segment } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsShare extends Component {
  state = {
    modalOpen: false,
    cardToTake: '',
    traderToReceive: {},
    give: true,
    color: 'grey'
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  // give a card
  // take a card
  // remove or add to other player 
  // confirm

  setCardToTake = (e, card) => {
    console.log("setCard", card)
    e.preventDefault()
    this.setState({ cardToTake: card })
    this.setState({ color: card.props.color })
  }

  // //////// give cards ////////
  displayCardsToGive = (traders, activePlayer) => {
    return (
      <div>
        <Grid container columns={2} doubling stackable>
          <Grid.Column>
            <Header color="grey">{activePlayer.name} is giving cards to ...</Header>
            {
              activePlayer.hand.length && activePlayer.hand.map((card) => {
                if (card.city) {
                  const cityName = card.city
                  return (
                    <div key={cityName}>
                      <Button size="small" onClick={(e) => this.setCardToTake(e, card)} color={card.props.color} ></Button>
                      <span>{cityName}</span>
                    </div>
                  )
                }
              })
            }
          </Grid.Column>
          <Grid.Column>
            <Header color="grey">Traders</Header>
            {
              traders.length && traders.map((trader) => {
                return (
                  <div key={trader.name}>
                    <Button size="small" onClick={(e) => this.setTraderToReceive(e, trader)} key={trader.name} >{trader.name}</Button>
                  </div>
                )
              })
            }
          </Grid.Column>
        </Grid>
      </div>
    )
  }

  // //////// take cards ////////
  displayCardsToTake = (traders) => {
    if (traders.length) {
      return (
        <div>
          <Grid container columns={1} doubling stackable>
            <Grid.Column>
              <Header color='grey' content={`Which card are you taking?`} />
          {this.state.cardToTake.city && <Header color='grey' content={`${this.state.cardToTake.city}`} />}
            </Grid.Column>
          </Grid>
          <Grid container columns={traders.length} doubling stackable>
            {
              traders.map((player) => {
                return (
                  <Grid.Column key={player.name}>
                    <Header color="grey">{player.name}</Header>
                    {
                      player.hand.length && player.hand.map((card) => {
                        if (card.city) {
                          const cityName = card.city
                          return (
                            <div key={card.city}>
                              <Button size="small" onClick={(e) => this.setCardToTake(e, card)} color={card.props.color} ></Button>
                              <span>{cityName}</span>
                            </div>
                          )
                        }
                      })
                    }
                  </Grid.Column>
                )
              })
            }
          </Grid>
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
          <Grid container columns={2} doubling stackable>
            <Grid.Column>
              <Header color='grey' content={`Sharing Knowledge`} />
            </Grid.Column>
            <Grid.Column>
              <Button.Group>
                <Button onClick={this.toggleGive}>Give</Button>
                <Button.Or />
                <Button positive onClick={this.toggleGive}>Take</Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
          {this.displayCardsForTrade()}
        </Modal.Content>
        <Modal.Actions>
          <Button size="small" onClick={this.tradeKnowledge} disabled={!this.state.cardToTake.city} >Confirm</Button>
          <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
        </Modal.Actions>
      </Modal >
    )
  }
}
