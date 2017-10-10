import React, {Component} from 'react'
import { Button, Popup } from 'semantic-ui-react'
import fire from '../../fire'
const db = fire.database()
export default class Alerts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openPopUp: false
    }
  }
  componentDidMount() {
    var oldSnap
    db.ref(`/rooms/${this.props.roomName}/players/${this.props.currPlayer}/hand`).on('value', function(dataSnap) {
      if (oldSnap && dataSnap.val() !== oldSnap.val()) {
        this.setState({
          openPopUp: true
        })
      }
      oldSnap = dataSnap
    })
  }
  render() {
    return (
      <Popup
        open= {this.state.openPopUp}
        content="Dealing new cards"
        basic
      />
    )
  }
}
