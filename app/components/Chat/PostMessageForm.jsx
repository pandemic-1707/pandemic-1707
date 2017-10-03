import React from 'react'

class PostMessageForm extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.appendChatMessage(this.nameInput.value, this.messageInput.value)
    this.nameInput.value = ''
    this.messageInput.value = ''
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" className="form-control"
           ref={name => this.nameInput = name}
           placeholder="Name" />
        <input type="text" className="form-control"
           ref={message => this.messageInput = message}
           placeholder="Message" />
        <input className="btn btn-sm btn-primary" type="submit" value="Send" />
      </form>
    )
  }
}

export default PostMessageForm
