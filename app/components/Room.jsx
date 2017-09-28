import React, {Component} from 'react'
import {connect} from 'react-redux'
import firebase from '../../fire'

export default class Room extends Component {
  constructor(props) {
    super(props)
  }
  randomizeRole() {
    
  }
  render() {
    return(
      <div>
        <div id="player-sidebar">
          <div className="player-box">
            <div className="player-name">
              <img height="32" width="32" src="/medic.jpeg" />
              <div>
                Player1
                <br/>
                Medic
              </div>
            </div>
            <div className="player-hand">Hand</div>
          </div>
        </div>
      </div>
    )
  }
}