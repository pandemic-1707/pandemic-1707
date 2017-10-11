import React from 'react'
import firebase from '../../fire'
import ignite, {withAuth, FireInput} from '../utils/ignite'
import {Button, Form} from 'semantic-ui-react'

const users = firebase.database().ref('users')
    , nickname = uid => users.child(uid).child('nickname')

const Nickname = ignite(
  ({value}) => <span className='chat-message-nick'>{value}</span>
)

const ChatMessage = ignite(
  ({value}) => {
    if (!value) return null
    const {from, body} = value
    return <div className='chat-message'>
      <Nickname fireRef={nickname(from)} />
      <span className='chat-message-body'>{body}</span>
    </div>
  }
)

export default ignite(withAuth(class extends React.Component {
  // Write is defined using the class property syntax.
  // This is roughly equivalent to saying,
  //
  //    this.sendMessage = event => (etc...)
  //
  // in the constructor. Incidentally, this means that write
  // is always bound to this.
  sendMessage = event => {
    event.preventDefault()
    if (!this.props.fireRef) return
    this.props.fireRef.push({
      from: firebase.auth().currentUser.uid,
      body: event.target.body.value
    })
  }

  renderSendMsg(user) {
    if (!user) {
      return <span>You must be logged in to send messages.</span>
    }
    return <Form onSubmit={this.sendMessage}>
      <FireInput fireRef={nickname(user.uid)} placeholder='your name' />
      <Form.Input placeholder='Type your message...' name='body' />
      <Form.Button size="small" color="orange">Submit</Form.Button>
    </Form>
  }

  render() {
    const {user, snapshot, asEntries} = this.props
        , messages = asEntries(snapshot)
    return <div>
      <div className='chat-log'> {
        messages.map(({key, fireRef}) => <ChatMessage key={key} fireRef={fireRef}/>)
      } </div>
      {this.renderSendMsg(user)}
    </div>
  }
}))
