Template.GameControl.helpers ({
  gamesWaiting: function() {
    return Games.find({players: {$size: 1}});
  },

  gameInProgress: function() {
    return Session.get('gameId');
  }
});

Template.GameControl.events ({
  'click p.waiting-queue': function(evt) {
    var joinGameId = evt.target.id;

    Games.update(
      {_id: joinGameId},
      {$addToSet: {players: {device: Session.get('deviceId'), matches: [], totalScore: 0, deviceName: 'Green'}}},
      function(err, res) {
        Session.set('gameId', joinGameId);
        localStorage.setItem('sm_gameId', joinGameId);

        Session.set('message', 'Game on! Player 2 has the first move.');
      }
    );
  },

  'click #newGame': function(evt) {
    Meteor.call('newGame', Session.get('deviceId'), function (err, res) {
      var newGameId = res;
      Session.set('gameId', newGameId);
      localStorage.setItem ('sm_gameId', Session.get('gameId'));

      Session.set('message', 'Waiting for challenger to join.');
    });
  },
  
  'click #leaveGame': function(evt) {
    var conf = window.confirm('Really? End this game?');
    if (conf == true) {
      Meteor.call('removeMyGame', Session.get('gameId'), Session.get('deviceId'));
      Session.set('gameId', '');
      localStorage.setItem('sm_gameId', '');
    }

  }
});
