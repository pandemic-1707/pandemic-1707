import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Label, Grid, Segment, Divider } from 'semantic-ui-react'
import fire from '../../fire'

const initialState = {
  modalOpen: false,
  traderToGive: { name: false },
  cardToTake: { city: false },
  cardToGive: { city: false },
  traderToReceive: { name: false },
  give: true,
  color: 'grey'
}

export default class PlayerActionsShare extends Component {

  state = initialState

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.resetState()
    this.setState({ modalOpen: false })
  }

  resetState = () => this.setState(initialState)

  // give a card
  // take a card
  // remove or add to other player 
  // confirm

  // //////// give cards ////////

  setCardToGive = (e, card) => {
    e.preventDefault()
    this.setState({
      color: card.props.color,
      cardToGive: card
    })
  }

  setTraderToReceive = (e, trader) => {
    e.preventDefault()
    this.setState({
      traderToReceive: trader
    })
  }

  giveCard = (e) => {
    e.preventDefault()
    const receiver = this.state.traderToReceive
    const cardToGive = this.state.cardToGive
    // give card to receiver
    let receiverNewHand = [cardToGive]
    if (receiver.hand) receiverNewHand = [...receiver.hand, cardToGive]
    fire.database().ref(`/rooms/${this.props.roomName}/players/${receiver.playerKey}`).update({
      hand: receiverNewHand
    })
    // remove card from current player hand
    const activePlayerNewHand = this.props.activePlayer.hand.filter((card) => {
      return card.city !== cardToGive.city
    })
    const currNumActions = this.props.activePlayer.numActions
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerKey}`).update({
      hand: activePlayerNewHand,
      numActions: currNumActions - 1
    })
    this.handleClose()
  }

  displayCardsToGive = (traders, activePlayer) => {
    if (activePlayer.hand && activePlayer.hand.length > 0) {
      const toGiveHand = activePlayer.hand.filter((card) => {
        return card.city
      })
      if (toGiveHand.length) {
        return (
          <div>
            <Grid container columns={2} doubling stackable>
              <Grid.Column>
                <Header color="grey">{activePlayer.name} is giving which card?</Header>
                {this.state.cardToGive && <Header color="grey"> {this.state.cardToGive.city}</Header>}
                {
                  toGiveHand.map((card) => {
                    const cityName = card.city
                    return (
                      <div key={cityName}>
                        <Button size="small" onClick={(e) => this.setCardToGive(e, card)} color={card.props.color} ></Button>
                        <span>{cityName}</span>
                      </div>
                    )
                  })
                }
              </Grid.Column>
              <Grid.Column>
                <Header color="grey">To which player?</Header>
                {this.state.traderToReceive.name && <Header color="grey">{this.state.traderToReceive.name}</Header>}
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
            <Grid container columns={1} doubling stackable>
              <Grid.Column>
                <Button size="small" onClick={this.giveCard} disabled={!this.state.cardToGive.city || !this.state.traderToReceive.name} >Confirm</Button>
                <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
              </Grid.Column>
            </Grid>
          </div>
        )
      } else {
        return (
          <div>
            <Header color="grey">Only have event cards. Those are yours alone~</Header>
            <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
          </div>
        )
      }
    } else {
      return (
        <div>
          <Header color="grey">No cards to give to your friends. Why don't you take a card? You taker.</Header>
          <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
        </div>
      )
    }
  }

  // //////// take cards ////////

  setCardToTake = (e, card, giver) => {
    e.preventDefault()
    this.setState({
      color: card.props.color,
      cardToTake: card,
      traderToGive: giver
    })
  }

  takeCard = (e) => {
    e.preventDefault()
    const giver = this.state.traderToGive
    const cardToTake = this.state.cardToTake
    // remove card from giver
    let giverNewHand = giver.hand
    giverNewHand = giverNewHand.filter((card) => {
      return card.city !== cardToTake.city
    })
    fire.database().ref(`/rooms/${this.props.roomName}/players/${giver.playerKey}`).update({
      hand: giverNewHand
    })
    // add card to current player hand
    let activePlayerNewHand = []
    if (this.props.activePlayer.hand) {
      activePlayerNewHand = [...this.props.activePlayer.hand, cardToTake]
    } else {
      activePlayerNewHand = [cardToTake]
    }
    const currNumActions = this.props.activePlayer.numActions
    fire.database().ref(`/rooms/${this.props.roomName}/players/${this.props.activePlayer.playerKey}`).update({
      hand: activePlayerNewHand,
      numActions: currNumActions - 1
    })
    this.handleClose()
  }

  displayTraderHands = (player) => {
    if (player.hand) {
      return player.hand.map((card) => {
        if (card.city) {
          const cityName = card.city
          return (
            <div key={card.city}>
              <Button size="small" onClick={(e) => this.setCardToTake(e, card, player)} color={card.props.color} ></Button>
              <span>{cityName}</span>
            </div>
          )
        }
      })
    } else {
      return (
        <div>
          <Header color='grey' content={"Has nothing to offer in life."} />
        </div>
      )
    }
  }

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
                      this.displayTraderHands(player)
                    }
                  </Grid.Column>
                )
              })
            }
          </Grid>
          <Grid container columns={1} doubling stackable>
            <Grid.Column>
              <Button size="small" onClick={(e) => this.takeCard(e)} disabled={!this.state.cardToTake.city} >Confirm</Button>
              <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
            </Grid.Column>
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
    return (
      <div>
        {
          this.state.give ? this.displayCardsToGive(traders, activePlayer) : this.displayCardsToTake(traders)
        }
      </div >
    )
  }

  render() {
    return (
      <Modal
        trigger={<Button size="small" onClick={this.handleOpen} color="orange" disabled={this.props.traders.length < 1}>Share</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Modal.Content>
          <Grid container doubling stackable>
            <Grid.Row columns={2}>
            <Grid.Column>
              <Header color='grey' content={`Sharing Knowledge`} />
            </Grid.Column>
            <Grid.Column>
              <Button.Group>
                <Button onClick={this.toggleGive} color={this.state.give ? 'green' : 'grey'}>Give</Button>
                <Button.Or />
                <Button onClick={this.toggleGive} color={!this.state.give ? 'green' : 'grey'}>Take</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            {this.displayCardsForTrade()}
          </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal >
    )
  }
}
