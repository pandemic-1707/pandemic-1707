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
    if (curableColors && sameColors) {
      let colPortion = ''
      if (curableColors.length === 1) colPortion = 'sixteen'
      if (curableColors.length === 2) colPortion = 'eight'
      if (curableColors.length === 3) colPortion = 'five'
      if (curableColors.length === 4) colPortion = 'four'

      return (
        <div className="ui grid">
          {
            curableColors.map((color) => {
              return (
                <div className={`${colPortion} wide column`} key={color}>
                  <Button size="small" onClick={(e) => this.setFirstFive(e, color)} color={color} >{color}</Button>
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
        </div>
      )
    }
  }

  // let player use first 5 cards of that color for cure
  setFirstFive = (e, color) => {
    e.preventDefault()
    const firstFiveCureCards = this.props.curables.sameColors[color].slice(0, 5)
    this.setState({
      cureCards: firstFiveCureCards,
      color: color
    })
  }

  // cureCards is array of cards to be discarded for cure
  cureDisease = (e) => {
    e.preventDefault()
    const activePlayer = this.props.activePlayer
    const activePlayerCity = activePlayer && activePlayer.position && activePlayer.position.city
    const color = this.state.color
    const cureCards = this.state.cureCards
    // look for cure cards to discard and create newHand without the cure cards
    const newHand = activePlayer.hand.filter(function (card) {
      // newHand can't have any cards we want to discard
      return cureCards.every(function (cureCards) {
        return card.city !== cureCards.city
      })
    })
    fire.database().ref(`/rooms/${this.props.roomName}/players/${activePlayer.playerKey}`).update({
      numActions: activePlayer.numActions - 1,
      hand: newHand
    })
    // add to curedDiseases
    let newCuredDiseases = {}
    fire.database().ref(`/rooms/${this.props.roomName}/state/curedDiseases`).once('value', snapshot => {
      newCuredDiseases = snapshot.val()
      newCuredDiseases[color] = true
    })
      .then(() => {
        fire.database().ref(`/rooms/${this.props.roomName}/state`).update({
          curedDiseases: newCuredDiseases
        })
      })
    this.handleClose()
  }

  render() {
    return (
      <Modal
        trigger={<Button size="small" onClick={this.handleOpen} color="olive" disabled={!this.props.curables} >Cure</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header color={this.state.color} content={`Which disease are we curing?   ${this.state.color}`} />
        <Modal.Content>
          {this.displayCardsForCure()}
        </Modal.Content>
        <Modal.Actions>
          <Button size="small"
            onClick={this.cureDisease} color='olive'
            disabled={!this.state.cureCards.length} >
            Confirm</Button>
          {/* <Modal
            trigger={<Button size="small"
              onClick={this.cureDisease} color='olive'
              disabled={!this.state.cureCards.length} >
              Confirm</Button>}
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
          </Modal> */}
          <Button size="small" onClick={this.handleClose} color='grey' >Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
