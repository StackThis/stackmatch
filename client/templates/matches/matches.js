Template.Matches.helpers({
  scoreBoard: function() {
    var gameScore = {
      my: {},
      your: {},
    };
    var curGame = Games.findOne({_id: Session.get('gameId')}, {
      transform: function(doc) {
        var lastMove = doc.moves.pop();
        if (lastMove) {
          if (lastMove.turnIdx === 1) {
            doc.players[lastMove.playerIdx].myTurn = true;
          } else if (lastMove.playerIdx === 0) {
            doc.players[1].myTurn = true;
          } else {
            doc.players[0].myTurn = true;
          }
        } else {
          if (doc.players.length === 2) doc.players[1].myTurn = true;
        }

        for (i = 0; i <= 1; i++) {
          if (doc.players[i]) {
            if (doc.players[i].device === Session.get('deviceId')) {
              gameScore.my.playerIdx = i;
              gameScore.my.name = doc.players[i].deviceName;
              gameScore.my.score = doc.players[i].totalScore;
              gameScore.my.turn = doc.players[i].myTurn;
              gameScore.my.matches = doc.players[i].matches;
            } else {
              gameScore.your.playerIdx = i;
              gameScore.your.name = doc.players[i].deviceName;
              gameScore.your.score = doc.players[i].totalScore;
              gameScore.your.turn = doc.players[i].myTurn;
              gameScore.your.matches = doc.players[i].matches;
            }
          }
        }
        return gameScore;
      }
    });
    if (gameScore) return gameScore;
  }
});
