var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var gameSchema = new mongoose.Schema({
    playerId: String,
    playerScore: Number,
    dealerScore: Number,
    createDate: Date,
    updateDate: Date

}, { collection: 'tokens', strict: true });

var gameModel = mongoose.model('GameModel', gameSchema);

module.exports = gameModel;