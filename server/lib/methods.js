Meteor.methods ({
  newGame: function(deviceId, gameSize, gameId) {
    var deck;
    var NewDeck = function(bombs, num10, num15, num20, num25) {
      this.bombs = bombs;
      this.num10 = num10;
      this.num15 = num15;
      this.num20 = num20;
      this.num25 = num25;
      this.pairs = [];
      this.deck = [];
    }

    NewDeck.prototype.createDeck = function() {
      var numPairs = this.bombs + this.num10 + this.num15 + this.num20 + this.num25;
      for (var b = 0; b < this.bombs; b++) {
        this.pairs.push(0);
      }
      for (var c = this.bombs; c < numPairs; c++) {
        this.pairs.push(c);
      }
      this.deck = this.pairs.concat(this.pairs);
    }

    NewDeck.prototype.shuffleDeck = function(array) {
      //based on Fisher-Yates shuffle algorithm
      var currIndex = array.length;
      var tempValue;
      var randomIndex;
      while (0 !== currIndex) {
        randomIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;
        tempValue = array[currIndex];
        array[currIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
      }
      return array;
    }

    NewDeck.prototype.initializeGame = function(replayId) {
      self = this;
      var cardsShuffled = this.shuffleDeck(this.deck).map(function(value, index) {
        var score;
        if (value < self.bombs) {
          score = -30;
        } else if (value < self.bombs + self.num10) {
          score = 10;
        } else if (value < self.bombs + self.num10 + self.num15) {
          score = 15;
        } else if (value < self.bombs + self.num10 + self.num15 + self.num20) {
          score = 20;
        } else {
          score = 25;
        }
        return {'idx': index, 'val': value, 'score': score, 'class': 'turned-down'};
      });
      // initialize new game entry in db
      if (replayId) {
        return Games.update({_id: replayId},
          {$set: {
            grid: cardsShuffled,
            moves: [],
            'players.0.matches': [],
            'players.0.totalScore': 0,
            'players.1.matches': [],
            'players.1.totalScore': 0
          }})
      } else {
        return Games.insert({
          grid: cardsShuffled,
          gridSize: gameSize,
          gameStatus: 'fresh',
          moves: [],
          players: [{device: deviceId, matches: [], totalScore: 0, deviceName: 'Purple' }],
          timestamp: new Date().toISOString()
        });
      }

    }

    if (gameSize === 'Big') {
      deck = new NewDeck(3,7,8,7,3); //big deck
    } else {
      deck = new NewDeck(2,5,6,5,2); //small deck
    }
    deck.createDeck();
    return deck.initializeGame(gameId);
  },
  
  leaveGame: function(gameId, deviceId) {
    Games.update({_id: gameId}, {$pull: {players: {device: deviceId}}, $set: {gameStatus: 'dirty'}});
  },

  removeGame: function(gameId) {
    //only remove dirty game
    Games.remove({_id: gameId, gameStatus: 'dirty'});
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
