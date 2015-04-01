Template.Grid.helpers ({
  shuffledCards: function() {
    if (Session.get('gameId')) {
      var curGameId = Session.get('gameId');
      var game = Grids.findOne(curGameId);
      // var game = Games.findOne(curGameId, {
      //   transform: function(doc) {
      //     for (i = 0; i < doc.grid.length; i++) {
      //       if (doc.grid[i].class === 'turned-down') {
      //         doc.grid[i].val = '';
      //         doc.grid[i].score = '';
      //       }
      //     }
      //     return doc
      //   }
      // });

      if (game) return game.grid;
      return false;
    }
  }
});

Template.Grid.events({
  'click li': function(evt) {
    evt.preventDefault();
    var thisMove = {
      cardIdx: parseInt(evt.target.id.split('-')[1]),
      turnIdx: 1,    // 1 or 2
      playerIdx: 1   // 0 or 1
    };

    var curGameData = Games.findOne({_id: Session.get('gameId')});
    var lastMove = curGameData.moves.pop();

    if (curGameData.grid[thisMove.cardIdx].class.indexOf('turned-up') > -1) return false;
    if (typeof lastMove !== 'undefined') {
      if (lastMove.turnIdx === 2) {
        // Next player first pick
        thisMove.playerIdx = (lastMove.playerIdx) === 1 ? 0 : 1;
        thisMove.turnIdx = 1;
        Session.set('message', 'Choose a second card.')
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
