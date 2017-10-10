import React, { Component } from 'react'
import WhoAmI from './WhoAmI'
import Rules from './Rules'
import EnterRoom from './EnterRoom'
import fire from '../../fire'
const auth = fire.auth()

export default class Welcome extends Component {
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          userId: user.uid
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    return (
      <div className="welcome">
        <WhoAmI auth={auth} />
        <div id="title">
          <h1 id="gametitle">PLANETAMIC</h1><br />
          <h2 id="gamecredit"> A Game by Emily Eastlake, An Le and Mary Yen </h2>
          <br />
          <EnterRoom />
          <br />
          <Rules />
        </div>
      </div>
    )
  }
}