var fire = require('../../fire');
var ref = fire.database().ref('myRefUrl');
ref.on('value', function (snapshot) {
  console.log(snapshot.val());
});