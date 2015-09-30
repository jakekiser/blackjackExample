var mongoose = require('mongoose');
var GameModel = require('../model/GameModel');
var _ = require('lodash');
var async = require('async');


/**
 * Logic/querying layer that prevents clutter in the controllers
 */
var GameManager = (function () {

    function GameManager() {
    }

    /**
     * Calculates the win/loss record for the user
     * @param playerId
     * @param callback
     */
    GameManager.getWinLossRecord = function(playerId, callback) {
        async.auto({
                "userWins": function(cb) {
                    GameManager.getUserWinCount(playerId, cb);
                },
                "userLosses": function(cb) {
                    GameManager.getUserLossCount(playerId, cb)
                }
        },
            function (err, results) {

                if (err) return callback(err);

                callback(null, {
                    wins: results.userWins,
                    losses: results.userLosses
                })
        });
    };

    /**
     * Queries the database to get the users win count
     * @param playerId
     * @param callback
     */
    GameManager.getUserWinCount = function(playerId, callback) {

        var criteria = {
            playerId : playerId,
            $and : [
                {playerScore : {$lte : 21}},
                {$or : [
                    {"$where": "this.playerScore >= this.dealerScore"},
                    {dealerScore : {$gt: 21}}
                ]}
            ]
        };

        GameModel.count(criteria, function (err, count) {
            if (err) return callback(err, null);
            return callback(null, count);
        });
    };

    /**
     * Queries the database to get the users loss count
     * @param playerId
     * @param callback
     */
    GameManager.getUserLossCount = function (playerId, callback) {

        var criteria = {
            playerId : playerId,
            $and : [
                {dealerScore : {$lte : 21}},
                {$or : [
                    {$where: "this.playerScore < this.dealerScore"},
                    {playerScore : {$gt : 21}}
                ]}
            ]
        };

        GameModel.count(criteria, function (err, count) {
            if (err) return callback(err, null);
            return callback(null, count);
        });
    };

    /**
     * Store a game record in the database
     * @param gameRecord
     * @param callback
     * @returns {Error}
     */
    GameManager.createGameRecord = function(gameRecord, callback) {
        if (!gameRecord || _.isEmpty(gameRecord)) return new Error('gameRecord cannot be null or empty');

        gameRecord.createDate = new Date();

        GameModel.create(gameRecord, function (err, doc) {
            if (err) return callback(err, null);
            return callback(null, doc);
        });
    };

    return GameManager;
})();
module.exports = GameManager;