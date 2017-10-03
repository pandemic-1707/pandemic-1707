import React, {Component} from 'react'
import Map from './GameMap'
import Sidebar from './Sidebar'
import Chat from './ChatBox'
import NavBar from './NavBar'

export default class Room extends Component {
  render() {
    return (
      <div>
        <div className="main">
          <div className="sidebar">
            <div><Sidebar roomName={this.props.match.params.roomName}/></div>
            <div><Chat /></div>
          </div>
          <div className="main-content">
            <NavBar roomName={this.props.match.params.roomName} />
            <Map roomName={this.props.match.params.roomName} />
            <footer className="footer">Placeholder</footer>
          </div>
        </div>
      </div>
    )
  }
}
