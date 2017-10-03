import React, {Component} from 'react'
import Map from './GameMap'
import Sidebar from './Sidebar'
import Chat from './ChatBox'
import PlayerActions from './PlayerActions'

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
            <Map />
            <footer className="footer">
              <div><PlayerActions roomName={this.props.match.params.roomName}/></div>
            </footer>
          </div>
        </div>
      </div>
    )
  }
}
