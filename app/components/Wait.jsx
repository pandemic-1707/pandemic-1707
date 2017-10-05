import React, {Component} from 'react'
import fire from '../../fire/index'
import shuffle from 'shuffle-array'
const auth = fire.auth()

export default class Wait extends Component {
  constructor(props) {
    super(props)
    this.state = {
      LoggedIn: false,
      user: {}
    }
    this.startGame = this.startGame.bind(this)
  }
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          LoggedIn: true,
          user: user
        })
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  startGame(e) {
    e.preventDefault()
    const { user } = this.state
    const roles = ['Scientist', 'Generalist', 'Researcher', 'Medic', 'Dispatcher']
    const colors = [ { name: 'pink', 'hexVal': '#EB0069' },
      { name: 'blue', 'hexVal': '#00BDD8' },
      { name: 'green', 'hexVal': '#74DE00' },
      { name: 'yellow', 'hexVal': '#DEEA00' } ]
    // assign each player's a constant offset from the city depending on numPlayers
    // guarantees that markers won't render on top of each other
    
    fire.database().ref(`/rooms/${this.props.match.params.roomName}`).update({
      shuffledRoles: shuffle(roles),
      shuffledColors: shuffle(colors),
    })
    fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(snapshot => {
      const offsets = (function(nPlayers) {
        switch (nPlayers) {
        case 2: return [[-1, -1], [-1, 1]]
        case 3: return [[0, -1], [-1, 0], [0, 1]]
        case 4: return [[0, -1], [-1, -1], [-1, 1], [0, 1]]
        }
      })(snapshot.val().numPlayers)
      fire.database().ref(`/rooms/${this.props.match.params.roomName}/players`).set({
        [user.uid]: {
          name: user.displayName,
        },
        numPlayers: snapshot.val().numPlayers
      })
      .then(() => {
        fire.database().ref(`/rooms/${this.props.match.params.roomName}`).once('value').then(newSnapshot => {
          const myOrder = Object.keys(newSnapshot.child('players').val()).indexOf(user.uid)
          const myRole = newSnapshot.val().shuffledRoles[myOrder]
          const myColor = newSnapshot.val().shuffledColors[myOrder]
          return fire.database().ref(`/rooms/${this.props.match.params.roomName}/players/${user.uid}`).update({
            role: myRole,
            color: myColor,
            offset: offsets[myOrder]
          })
          .then(() => 
            this.props.history.push(`/rooms/${this.props.match.params.roomName}`)
          )
        })
      })
    })
  }
  render() {
    return (
      <div><button onClick={this.startGame} className="btn btn-success">Start Game</button></div>
    )
  }
}
