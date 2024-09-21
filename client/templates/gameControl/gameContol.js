Template.GameControl.helpers({
  gamesWaiting: async function () {
    var gameList = await Games.find({
      players: { $size: 1 },
      gameStatus: "fresh",
    }).fetchAsync();
    if (gameList.length > 0) {
      return gameList;
    }
  },

  gameInProgress: async function () {
    var dirtyCount = await Games.find({
      _id: Session.get("gameId"),
      gameStatus: "dirty",
    }).countAsync();
    if (dirtyCount > 0) {
      await Games.removeAsync({ _id: Session.get("gameId") });
      Session.set("gameId", "");
      localStorage.setItem("sm_gameId", "");
      alert("Your opponent has left the game.");
    }
    return Session.get("gameId");
  },

  gameCompleted: function () {},
});

Template.GameControl.events({
  "click #instructions": function (evt) {
    var instructionSymbol = document.getElementById("instructionsSymbol");
    var instructionText = document.getElementById("instructionsWrapper");

    if (instructionText.classList.contains("instructions-hidden")) {
      instructionSymbol.innerHTML = '<i class="fa fa-toggle-up  fa-lg"></i>';
      instructionText.classList.remove("instructions-hidden");
    } else {
      instructionSymbol.innerHTML = '<i class="fa fa-toggle-down  fa-lg"></i>';
      instructionText.classList.add("instructions-hidden");
    }
  },

  "click section.waiting-queue": async function (evt) {
    var joinGameId = this._id;

    await Games.updateAsync(
      { _id: joinGameId },
      {
        $addToSet: {
          players: {
            device: Session.get("deviceId"),
            matches: [],
            totalScore: 0,
            deviceName: "Green",
          },
        },
      }
    );
    Session.set("gameId", joinGameId);
    localStorage.setItem("sm_gameId", joinGameId);
  },

  "click #new-game-little": async function (evt) {
    var gameSize = "Little";

    await Meteor.callAsync("newGame", Session.get("deviceId"), gameSize).then(
      function (res) {
        var newGameId = res;
        Session.set("gameId", newGameId);
        localStorage.setItem("sm_gameId", Session.get("gameId"));
      }
    );
  },

  "click #new-game-big": async function (evt) {
    var gameSize = "Big";

    await Meteor.callAsync("newGame", Session.get("deviceId"), gameSize).then(
      function (res) {
        var newGameId = res;
        Session.set("gameId", newGameId);
        localStorage.setItem("sm_gameId", Session.get("gameId"));
      }
    );
  },

  "click #leave-game": async function (evt) {
    var conf = window.confirm("Really? End this game?");
    if (conf == true) {
      await Meteor.callAsync(
        "leaveGame",
        Session.get("gameId"),
        Session.get("deviceId")
      ).then(function (res) {
        // console.log(res);
      });
      Session.set("gameId", "");
      localStorage.setItem("sm_gameId", "");
    }
  },

  "click #restart-game": async function (evt) {
    await Meteor.callAsync(
      "newGame",
      Session.get("deviceId"),
      null,
      Session.get("gameId")
    ).then(function (res) {
      // console.log(res);
    });
  },
});
