import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import cureUtils from '../utils/cure-utils.js'
import fire from '../../fire'

const NUM_CARDS_FOR_CURE = 5

export default class PlayerActionsCure extends Component {
  state = {
    modalOpen: false,
    color: '',
    cureCards: []
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  // ///////CURE///////
  // canCureDisease > displayCardsForCure > handleCureCardChange, handleCureCardConfirm > cureDisease > change treat func so that it will auto cure all disease

  // allow player to choose 5 cards to discard for cure
  // takes obj of form { curableColors: curableColors, sameColors: sameColors }
  // from canCureDisease
  displayCardsForCure = () => {
    const curableColors = this.props.curables.curableColors
    const sameColors = this.props.curables.sameColors
    console.log(curableColors, sameColors)
    return (
      <div>
        <form id="select-cards-for-cure" onSubmit={() => (this.cureDisease())}>
          {
            curableColors.map((color) => {
              return (
                <div>
                  <button onClick={this.setFirstFive}>blue</button>
                  {/* <Button size="small" onClick={() => (this.setFirstFive(color))} color={color}>{color}</Button> */}
                  {
                    sameColors[color].map((card) => {
                      const cityName = card.city
                      return <div key={cityName} value={cityName}>{cityName}</div>
                    })
                  }
                </div>
              )
            })
          }
        </form>
        <Button size="small" onClick={this.handleSubmit} color='white'>Confirm</Button>
      </div>
    )
  }

  // let player use first 5 cards of that color for cure
  setFirstFive = () => {
    const color = 'blue'
    const firstFiveCureCards = this.props.curables.sameColors[color].slice(0, 5)
    this.setState({
      cureCards: firstFiveCureCards,
      color: color
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.cureDisease()
  }

  // cureCards is array of cards to be discarded for cure
  cureDisease = () => {
    const activePlayer = this.props.activePlayer
    const activePlayerCity = activePlayer && activePlayer.position && activePlayer.position.city
    const color = this.state.color
    const cureCards = this.state.cureCards
        console.log('COLOR AND CURE', color, cureCards)
    // look for cure cards to discard and create newHand without the cure cards
    const newHand = activePlayer.hand.filter(function (card) {
      // newHand can't have any cards we want to discard
      return cureCards.every(function (cureCards) {
        return card.city !== cureCards.city
      })
    })
    console.log('NEW HAND', newHand)
    fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
      numActions: activePlayer.numActions - 1,
      hand: newHand
    })
    // add to curedDiseases
    let newCuredDiseases = []
    fire.database().ref(`/rooms/${this.props.roomName}/state/curedDiseases`).once('value', snapshot => {
      newCuredDiseases = snapshot.val()
      newCuredDiseases.push(color)
      console.log("NEW CURES", newCuredDiseases)
    })
      .then(() => {
        fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
          curedDiseases: newCuredDiseases
        })
      })

    // TODO: ... have treat disease clear all 3 infection rate for the color 
  }

  render() {
    return (
      <Modal
        trigger={<Button size="small" onClick={this.handleOpen} color="olive">Cure</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='cureCards' />
        <Modal.Content>
          <h3>You can cure a disease</h3>
          {this.displayCardsForCure()}
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
