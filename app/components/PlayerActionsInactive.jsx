import React, { Component } from 'react'
import { Button, Menu } from 'semantic-ui-react'
import fire from '../../fire'

export default class PlayerActionsInactive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPlayer: '',
      players: {}
    }
  }
  componentDidMount() {
    fire.database().ref(`/rooms/${this.props.roomName}/players`).on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({
          players: snapshot.val(),
        })
      }
    })
    fire.database().ref(`/rooms/${this.props.roomName}/state/currPlayer`).on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({
          currPlayer: snapshot.val(),
        })
      }
    })
  }
  render() {
    const {currPlayer, players} = this.state
    return (
      <Menu inverted>
        <Menu.Item>
          <Button disabled color="green" >Move</Button>
        </Menu.Item>
        <Menu.Item>
          <Button disabled color="blue">Treat
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button disabled color="orange">Cure</Button>
        </Menu.Item>
        <Menu.Item>
          <Button disabled color="violet">Build</Button>
        </Menu.Item>
        <Menu.Item>
          <Button disabled color="yellow">
            Share
        </Button>
        </Menu.Item>
        <Menu.Item>
          <Button disabled color="teal">
            Event
        </Button>
        </Menu.Item>
      </Menu>
    )
  }
}
