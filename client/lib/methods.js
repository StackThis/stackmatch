Meteor.methods({
  // Meteor methods stubs to mimic real methods called on backend
  // for the sake of latency compensation.
  flipUpCard: function(gameId, thisMove, lastMove) {
    return Games.update(
      {_id: gameId, 'grid.idx': thisMove.cardIdx},
      {$set: {'grid.$.class': 'turned-up player-' + thisMove.playerIdx}}
    );
  }
});