var mongoose = require('mongoose');
var httpStatus = require('http-status');
var GameManager = require('./manager/GameManager');

/**
 * These are the acutal controller functions. By design they do little more than talk to the GameManager and
 * relay the results
 */
var BlackJackController = (function () {

    function BlackJackController() {
    }

    /**
     * Return a player win/loss record
     * @param req
     * @param res
     */
    BlackJackController.getPlayerHistory = function (req, res) {

        GameManager.getWinLossRecord(req.params.playerId, function(err, docs) {
            if (err) res.status(httpStatus.INTERNAL_SERVER_ERROR);
            res.json(docs);
        });
    };

    /**
     * Insert a game record into the database
     * @param req
     * @param res
     */
    BlackJackController.postGameRecord = function (req, res) {

        GameManager.createGameRecord(req.body, function (err, doc) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({});
            return res.json(doc);
        });
    };

    return BlackJackController;
})();

module.exports = BlackJackController;