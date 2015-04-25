Template.GameControl.helpers ({
  gamesWaiting: function() {
    var gameList = Games.find({players: {$size: 1}, gameStatus: 'fresh'}).fetch();
    if (gameList.length > 0) {
      return gameList;
    }
  },

  gameInProgress: function() {
    var isDirty = Games.find({_id: Session.get('gameId'), gameStatus: 'dirty'});
    if (isDirty.count()) {
      Games.remove({_id: Session.get('gameId')});
      Session.set('gameId', '');
      localStorage.setItem('sm_gameId', '');
      alert('Your opponent has left the game.');
    }
    return Session.get('gameId');
  },

  gameCompleted: function() {
    
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
      }
    );
  },

  'click #new-game-little': function(evt) {
    var gameSize = 'Little';

    Meteor.call('newGame', Session.get('deviceId'), gameSize, function(err, res) {
      var newGameId = res;
      Session.set('gameId', newGameId);
      localStorage.setItem ('sm_gameId', Session.get('gameId'));
    });
  },

  'click #new-game-big': function(evt) {
    var gameSize = 'Big';

    Meteor.call('newGame', Session.get('deviceId'), gameSize, function(err, res) {
      var newGameId = res;
      Session.set('gameId', newGameId);
      localStorage.setItem ('sm_gameId', Session.get('gameId'));
    });
  },

  'click #leave-game': function(evt) {
    var conf = window.confirm('Really? End this game?');
    if (conf == true) {
      Meteor.call('leaveGame', Session.get('gameId'), Session.get('deviceId'));
      Session.set('gameId', '');
      localStorage.setItem('sm_gameId', '');
    }
  },

  'click #restart-game': function(evt) {
    Meteor.call('newGame', Session.get('deviceId'), null, Session.get('gameId'), function(err, res) {
      console.log(res);
    });
  }
});
