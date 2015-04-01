Meteor.startup(function() {
  Session.set('message', 'test message');
  if (!(localStorage.getItem('sm_deviceId'))) {
    // if no sm_deviceId, then try to get it from sm_gameId query
    
    // if search fails genereate new id
    var newId = new Meteor.Collection.ObjectID;
    localStorage.setItem('sm_deviceId', newId._str);
  }
  Session.set('deviceId', localStorage.sm_deviceId);
  Session.set('gameId', localStorage.sm_gameId);
});