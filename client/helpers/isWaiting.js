UI.registerHelper("isWaiting", function(playerArray) {
  if (playerArray && playerArray.length === 1) {
    url = window.location.origin + '/#' + Session.get('gameId');
    console.log(url);
    return 'Waiting for Challenger (' +url + ')';
  }
  else {
    return '';
  }
});