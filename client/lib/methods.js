Meteor.methods({
  // Meteor methods stubs to mimic real methods called on backend
  // for the sake of latency compensation.
  async flipUpCard(gameId, thisMove, lastMove) {
    return await Games.updateAsync(
      { _id: gameId, "grid.idx": thisMove.cardIdx },
      { $set: { "grid.$.class": "turned-up player-" + thisMove.playerIdx } }
    );
  },
});
