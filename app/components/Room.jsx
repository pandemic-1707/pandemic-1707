import React, {Component} from 'react'
import Map from './GameMap'
import Sidebar from './Sidebar'

export default class Room extends Component {
  render() {
    return (
      <div>
        <div className="main">
          <div className="sidebar">
            <Sidebar roomName={this.props.match.params.roomName} />
          </div>
          <div className="main-content">
            <Map roomName={this.props.match.params.roomName} />
          </div>
        </div>
        <footer className="footer">Placeholder</footer>
      </div>
    )
  }
}
