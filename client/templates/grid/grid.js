Template.Grid.helpers ({
  shuffledCards: function() {
    if (Session.get('gameId')) {
      var curGameId = Session.get('gameId');
      var game = Grids.findOne(curGameId);

      if (game) return game.grid;
      return false;
    }
  }
});

Template.Grid.events({
  'click li': function(evt) {
    evt.preventDefault();
    var thisMove = {
      //cardIdx: parseInt(evt.target.id.split('-')[1]),
      cardIdx: this.idx,
      turnIdx: 1,    // 1 or 2
      playerIdx: 1   // 0 or 1
    };

    if (this.class.indexOf('turned-up') >= 0) return false;
    var curGameData = Games.findOne({_id: Session.get('gameId')});
    if (curGameData.players.length < 2) return false;
    var lastMove = curGameData.moves.pop();

    if (typeof lastMove !== 'undefined') {
      if (lastMove.turnIdx === 2) {
        // Next player first pick
        thisMove.playerIdx = (lastMove.playerIdx) === 1 ? 0 : 1;
        thisMove.turnIdx = 1;
        Session.set('message', 'Choose a second card.');
      } else {
        // Same player second pick
        if (thisMove.cardIdx === lastMove.cardIdx) return false;
        thisMove.playerIdx = lastMove.playerIdx;
        thisMove.turnIdx = 2;
      }
    }

    if (Session.get('deviceId') === curGameData.players[thisMove.playerIdx].device) {
      Meteor.call('flipUpCard', Session.get('gameId'), thisMove, lastMove);
    }
  }
});
