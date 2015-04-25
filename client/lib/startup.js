Meteor.startup(function() {
  Session.set('message', 'test message');
  if (!(localStorage.getItem('sm_deviceId'))) {
    // if no sm_deviceId, then try to get it from sm_gameId query

    // if search fails genereate new id
    var newId = new Meteor.Collection.ObjectID;
    localStorage.setItem('sm_deviceId', newId._str);
  }
  Session.set('deviceId', localStorage.sm_deviceId);
  Session.set('gameId', localStorage.sm_gameId);


  // override current game if linked to new game
  if (window.location.hash) {
    var urlHash = window.location.hash.substring(1);
    var urlOrigin = window.location.origin;
    if (urlHash.length === 17) {
      Session.set('gameId', '');
      localStorage.setItem('sm_gameId', '');
      Games.update(
        {_id: urlHash},
        {$addToSet: {players: {device: Session.get('deviceId'), matches: [], totalScore: 0, deviceName: 'Green'}}},
        function(err, res) {
          Session.set('gameId', urlHash);
          localStorage.setItem('sm_gameId', urlHash);
          window.location.href = urlOrigin;

          Session.set('message', 'Game on! Player 2 has the first move.');
        }
      );
    } 
  }
});