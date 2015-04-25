Grids = new Meteor.Collection('grids');
Games = new Meteor.Collection('games');

Games.allow({
  update: function(userId, doc, fieldNames, modifier) {
    if (_.contains(fieldNames, 'grid')) {
      return modifier.$set;
    }
    if (_.contains(fieldNames, 'players')) {
      return modifier.$addToSet.players;
    } else {
      return modifier.$pull.players;
    }
  },

  remove: function(userId, doc) {
    return true;
  }
});