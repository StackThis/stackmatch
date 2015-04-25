UI.registerHelper("whoseTurn", function(myTurn) {
  if (myTurn) {
    return 'alert-player-turn';
  }
  else {
    return '';
  }
});