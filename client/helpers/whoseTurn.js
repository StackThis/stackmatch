UI.registerHelper("whoseTurn", function(myTurn) {
  if (myTurn) {
    return 'alert-blink';
  }
  else {
    return '';
  }
});