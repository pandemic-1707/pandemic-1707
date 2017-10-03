import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class PlayerActions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: {},
    }
  }

  componentDidMount() {

  }

  handleChange = (e) => {
    this.setState({ value: e.target.value })
    console.log('Dropdown changed')
  }

  render() {
    return (
      <div className="ui form">
        <div className="field">
          <select className="ui upward dropdown" onChange={this.handleChange} value={this.state.value}>
            <option value="">Select Dictionary</option>
            <option value="1">Dictionary 1</option>
            <option value="2">Dictionary 2</option>
          </select>
        </div>
      </div>
    )
  }
}
