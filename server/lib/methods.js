Meteor.methods ({
  newGame: function(deviceId) {
    var cards = [];
    var score = 0
    for (i=1; i<=20; i++) {
      cards.push(i);
    }
    // make a random shuffle of all pairs and assign score
    var cardsDup = cards.concat(cards);
    var cardsShuffled = shuffle(cardsDup).map(function(value, index) {
      if (value < 3) {
        score = -30;
      } else if (value < 8) {
        score = 10;
      } else if (value < 13) {
        score = 15;
      } else if (value < 18) {
        score = 20;
      } else {
        score = 25;
      }
      return {'idx': index, 'val': value, 'score': score, 'class': 'turned-down'};
    });

    // initialize new game entry in db
    return Games.insert({
      grid: cardsShuffled,
      moves: [],
      players: [{device: deviceId, matches: [], totalScore: 0, deviceName: 'Purple' }],
      timestamp: new Date().toISOString()
    });
    //console.log('game added')
  },

  removeMyGame: function(gameId, deviceId) {
    //only remove games initiated by the user
    Games.remove({
      _id: gameId,
      'players.device': deviceId
    })
  },

  flipUpCard: function(gameId, thisMove, lastMove) {
    Games.update(
      {_id: gameId, 'grid.idx': thisMove.cardIdx},
      {$set: {'grid.$.class': 'turned-up player-' + thisMove.playerIdx}, $push: {moves: thisMove}}
    );

    if (thisMove.turnIdx === 2) {
      curGameData = Games.findOne({_id: gameId});
      if (curGameData.grid[thisMove.cardIdx].val === curGameData.grid[lastMove.cardIdx].val) {
        var thisMatch = curGameData.grid[thisMove.cardIdx];
        if (thisMove.playerIdx === 0) {
          Games.update(
            {_id: gameId},
            {$set: {'players.0.totalScore': curGameData.players[0].totalScore + thisMatch.score}, $push: {'players.0.matches': thisMatch}}
          );
        } else {
          Games.update(
            {_id: gameId},
            {$set: {'players.1.totalScore': curGameData.players[1].totalScore + thisMatch.score}, $push: {'players.1.matches': thisMatch}}
          );
        }
        return 'Match Found'
      } else {
        Meteor.setTimeout(function() {
          Games.update({_id: gameId, 'grid.idx': thisMove.cardIdx}, {$set: {'grid.$.class': 'turned-down'}});
          Games.update({_id: gameId, 'grid.idx': lastMove.cardIdx}, {$set: {'grid.$.class': 'turned-down'}})
          return 'Not A Match';
        }, 3000)
      }
    } else {
      return 'Flip Another Card';
    }
  }
})
