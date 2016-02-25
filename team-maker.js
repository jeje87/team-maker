Players = new Mongo.Collection('players');
VoteUsers = new Mongo.Collection('voteusers');

if (Meteor.isClient) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

  // This code only runs on the client
  angular.module('team-maker',['angular-meteor','accounts.ui']);

  angular.module('team-maker').controller('TeamMakerCtrl',
    function ($scope,$meteor) {

      $scope.query = {};
      $scope.sort = {name: -1};

      $scope.players = $meteor.collection(function() {
        return Players.find($scope.query, {sort: $scope.sort})
      });

      $scope.voteusers = $meteor.collection(function() {
        return VoteUsers.find({})
      });

      $scope.addPlayer = function (name) {
        $scope.players.push( {
          name: name,
          vote: 0,
          createdAt: new Date() }
        );
      };

      $scope.aVotePourLui = function (player) {

        var voteUsers = VoteUsers.find({
          name: "me",
          player: player.name
        }).fetch();

        if(voteUsers.length>0) {
          return true;
        }

        return false;

      };

      $scope.vote = function (player) {

        var voteUsers = VoteUsers.find({
          name: "me",
          player: player.name
        }).fetch();

        if(voteUsers.length>0) {
          console.log("déja voté pour lui, mec !");
          return;
        }

        player.vote+=1;

        $scope.voteusers.push( {
          name: "me",
          player: player.name}
        );
      };

      $scope.unVote = function (player) {

        var voteUsers = VoteUsers.find({
          name: "me",
          player: player.name
        }).fetch();

        if(voteUsers.length<1) {
          console.log("jamais voté pour lui, mec !");
          return;
        }

        player.vote-=1;

        for(var i= 0; i<voteUsers.length; i++) {
          VoteUsers.remove( voteUsers[i]._id);
        }

      };

    });
}