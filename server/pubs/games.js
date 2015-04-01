// When publishing a list of games, keep each card val/score a secret.
Meteor.publish('allGames', function(gameId) {
  if (gameId) {
    return Games.find({_id: gameId}, {fields: {'grid.val': 0, 'grid.score': 0}});
  } else {
    return Games.find({players: {$size: 1}}, {fields: {grid: 0}});
  }
});

// When publishing the current game in play, publish a separate Grids collection of 
// cards that only reveals the val/score of cards that have been turned up.
Meteor.publish('myGame', function (gameId) {
  var self = this;
  if (!gameId) return;

  check(gameId, String);

  var fixGrid = function(array) {
    //console.log('fixGrid');
    for (i = 0; i < array.length; i++) {
      if (array[i].class === 'turned-down') {
        array[i].val = '';
        array[i].score = '';
      }
    }
    return array;
  };

  var cursor = Games.find({_id: gameId});
  var game = cursor.fetch()[0];
  var gridArray;
  var handle = cursor.observeChanges({
    removed: function(id) {
      //console.log('removed');
      self.removed("grids", id);
    },
    changed: function(id, fields) {
      //console.log('changed');
      if (fields.grid) {
        gridArray = fixGrid(fields.grid);
        self.changed("grids", id, {grid: gridArray});
      }
    }
  });

  //console.log('init');
  gridArray = fixGrid(game.grid);
  self.added('grids', gameId, {grid: gridArray});
  self.ready();

  self.onStop(function () {
    //console.log('stop');
    handle.stop();
  });
});
