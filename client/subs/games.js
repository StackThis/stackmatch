Tracker.autorun(function() {
  Meteor.subscribe('myGame', Session.get('gameId'));
  Meteor.subscribe('allGames', Session.get('gameId'));
});
