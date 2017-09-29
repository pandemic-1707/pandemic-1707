import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render() {
    return (
      <div class="title">
        <h1 id="gametitle">Pandemic</h1>
      </div>
    )
  }
}

export default (Home)
