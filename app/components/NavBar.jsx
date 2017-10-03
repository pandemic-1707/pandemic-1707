import React, { Component } from 'react'
import fire from '../../fire'

export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      red: 24,
      yellow: 24,
      black: 24,
      blue: 24,
      infectionIdx: 0,
      outbreaks: 0,
      researchCenter: 1
    }
  }
  componentWillMount() {
    // set local state to firebase state
    fire.database().ref(`/rooms/${this.props.roomName}`).update({state: this.state})
  }
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light bg-inverse">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <img src={'/images/redIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.red}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/blackIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.black}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/blueIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.blue}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/yellowIcon.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.yellow}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/infectionMarker.jpg'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.infection}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/OutbreakMarker.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.outbreaks}</div>
            </li>
            <li className="nav-item">
              <img src={'/images/researchCenter.png'} width="30" height="30" alt="" />
            </li>
            <li className="nav-item">
              <div className="nav-link">{this.state.researchCenter}</div>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}