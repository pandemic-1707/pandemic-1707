// import React, {Component} from 'react'
// import { Button, Header, Icon, Modal } from 'semantic-ui-react'
// import fire from '../../fire'
// const db = fire.database()
// export default class Alerts extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       alertOpen: false,
//       numActions: 0
//     }
//     this.handleOpen = this.handleOpen.bind(this)
//     this.handleClose = this.handleClose.bind(this)
//   }
//   handleOpen = () => this.setState({ alertOpen: true })

//   handleClose = () => this.setState({ alertOpen: false })

//   componentDidMount() {
//     let oldSnap
//     db.ref(`/rooms/${this.props.roomName}/players/${this.props.currPlayer}/hand`).on('value', dataSnap => {
//       const parent = dataSnap.ref.parent
//       parent.once('value').then(snapshot => {
//         if (snapshot.val()) {
//           this.setState({
//             numActions: snapshot.val().numActions
//           })
//         }
//       })
//       .then(() => {
//         // when we start dealing new cards -> alert
//         if (oldSnap && dataSnap.val() !== oldSnap.val() && this.state.numActions === 4) {
//           this.setState({
//             alertOpen: true
//           })
//         }
//         oldSnap = dataSnap
//       })
//     })
//   }
//   render() {
//     return (
//       <Modal
//         open={this.state.alertOpen}
//         onClose={this.handleClose}
//         basic
//         size='small'
//       >
//         <Header icon='clone' content='Dealing Hands!' />
//         <Modal.Content>
//           <h3>Woot!</h3>
//         </Modal.Content>
//         <Modal.Actions>
//           <Button color='green' onClick={this.handleClose} inverted>
//             <Icon name='checkmark' /> Ok
//           </Button>
//         </Modal.Actions>
//       </Modal>
//     )
//   }
// }
