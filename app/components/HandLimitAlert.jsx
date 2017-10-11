import React, {Component} from 'react'
import { Button, Header, Icon, Modal, Grid, Form, Message, Checkbox } from 'semantic-ui-react'
import fire from '../../fire'
const db = fire.database()
export default class Alerts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertOpen: false,
      handArr: [],
      disableSubmit: true,
      totalChecked: 1,
      discardedCards: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // listen to changes in hand
    db.ref(`/rooms/${this.props.roomName}/players/${this.props.currPlayer}/hand`).on('value', dataSnap => {
      const handArr = dataSnap.val()
      // if hand has more than 7 cards, display alerts
      if (handArr && handArr.length > 7) {
        this.setState({
          alertOpen: true,
          handArr: handArr
        })
      }
    })
    console.log('handArr', this.state.handArr)
  }
  handleClick = (e) => {
    let {totalChecked, discardedCards} = this.state
    this.setState({
      totalChecked: totalChecked + 1,
      // TODO: Need to exclude "off" values when box is checked off
      discardedCards: [...discardedCards, e.target.name]
    })
    // TODO: Need to disable button if totalChecked is more than, but enable again if one box is unchecked
    if (totalChecked == this.state.handArr.length - 7) {
      this.setState({disableSubmit: false})
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    let {handArr, discardedCards} = this.state
    const CardNameArr = []
    handArr.forEach(card => {
      if (Object.keys(card)[0] === 'city') CardNameArr.push(card.city)
      else CardNameArr.push(Object.keys(card)[0])
    })
    const newHandArr = handArr.filter(card => {
      // get city name or card name out to filer
      const city = card[city] || Object.keys(card)[0]
      console.log('city', city)
      return discardedCards.indexOf(city) === -1
    })
    console.log('newHandArr', newHandArr)
    // delete chosen card from hand on firebase
    db.ref(`/rooms/${this.props.roomName}/players/${this.props.currPlayer}`).update({
      hand: newHandArr
    })
    .then(() => {
      this.setState({alertOpen: false})
    })
  }
  render() {
    const {handArr, disableSubmit} = this.state
    const cardsNum = this.state.handArr.length
    return(
      <Modal open={this.state.alertOpen} basic>
        <Modal.Header>
          You have {cardsNum} cards on hand, please discard {cardsNum - 7}!
        </Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit} inverted>
            <Form.Group grouped>
              {
                handArr && handArr.map((card, i) => 
                  <Form.Field
                    label={card.city || Object.keys(card)[0]}
                    name={card.city || Object.keys(card)[0]}
                    control='input'
                    type='checkbox'
                    key={i}
                    onClick={this.handleClick}
                    />
                )
              }
            </Form.Group>
            <Button primary type='submit' disabled={disableSubmit}>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}
