import React from 'react'
import firebase from '../../fire'
import ignite, {withAuth, FireInput} from '../utils/ignite'
import {Button, Form} from 'semantic-ui-react'

const users = firebase.database().ref('users')
const nickname = uid => users.child(uid).child('nickname')

const Nickname = ignite(
  ({value}) => <span className='chat-message-nick'>{value}</span>
)

const ChatMessage = ignite(
  ({value}) => {
    if (!value) return null
    const {from, body} = value
    const textClass = (from === 'firebase') ? 'chat-message-firebase' : 'chat-message-body'
    return <div className='chat-message'>
      <Nickname fireRef={nickname(from)} />
      <span className={textClass}>{body}</span>
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

  constructor(props) {
    super(props)
    this.firebaseMessages = {}
  }

  componentDidMount() {
    this.props.roomRef.child('infectionMessage').on('value', snapshot => {
      const message = snapshot.val()
      if (message && this.props.fireRef && !this.firebaseMessages.hasOwnProperty(message)) {
        this.props.fireRef.push({
          from: 'firebase',
          body: message
        })
        this.firebaseMessages[message] = true
      }
    })

    this.props.roomRef.child('epidemicMessage').on('value', snapshot => {
      const message = snapshot.val()
      if (message && this.props.fireRef && !this.firebaseMessages[message]) {
        this.props.fireRef.push({
          from: 'firebase',
          body: message
        })
        console.log('giving it the property!')
        this.firebaseMessages[message] = true
      }
    })
  }

  renderSendMsg(user) {
    if (!user) {
      return <span>You must be logged in to send messages.</span>
    }
    return <Form onSubmit={this.sendMessage}>
      <Form.Input placeholder='Type your message...' name='body' />
      <Form.Button size="small" color="orange">Submit</Form.Button>
    </Form>
  }

  render() {
    const {user, snapshot, asEntries} = this.props
        , messages = asEntries(snapshot)
    return <div className='chat-box'>
      <div className='chat-log'> {
        messages.map(({key, fireRef}) => <ChatMessage key={key} fireRef={fireRef}/>)
      } </div>
      <div className='chat-form'>
        {this.renderSendMsg(user)}
      </div>
    </div>
  }
}))
