'use strict';

angular.module('myApp.blackjack', ['ngRoute', 'restangular', 'apiService', 'deckService'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/blackjack', {
        templateUrl: 'blackjack/blackjack.html',
        controller: 'BlackJackCtrl',
        controllerAs: 'vm'
    });
}])

.controller('BlackJackCtrl', ['apiService', 'deckService', BlackJackCtrl]);

function BlackJackCtrl(apiService, deckService) {
    var vm = this;

    vm.game = deckService;
    vm.getResult = getResult;
    vm.hitMe = hitMe;
    vm.playerId = 'abc123';
    vm.playerRecord = {};
    vm.startNewGame = startNewGame;
    vm.title = 'Player Stats';


    activate();

    function activate() {
        updatePlayerHistoryDisplay();
    }

    /**
     * Re-start the game or start a new one
     * re-initializes deck and hands
     */
    function startNewGame() {
        deckService.startNewGame();
    }

    /**
     * Hit the player, if they bust the game is over
     */
    function hitMe() {
        deckService.hitPlayer();
        if (deckService.getPlayerScore() > 21) {
            alert(deckService.getPlayerScore() + " You Busted!!");
            deckService.gameState.inProgress = false;
            postResults();
        }
    }

    /**
     * Tell the deckService to handle the dealers hand and get the result
     */
    function getResult() {
        var result = deckService.getWinner();
        var dealerScore = deckService.getDealerScore();
        var playerScore = deckService.getPlayerScore();
        deckService.gameState.inProgress = false;

        alert(result + " Wins Dealer Score: " + dealerScore + " Player Score: " + playerScore);
        postResults();
    }

    /**
     * Send the results of the game to the API
     */
    function postResults() {
        var dealerScore = deckService.getDealerScore();
        var playerScore = deckService.getPlayerScore();

        var postParams = {
            "playerScore": playerScore,
            "dealerScore": dealerScore,
            "playerId": vm.playerId
        };

        apiService.postGameResult(postParams, vm.playerId)
            .then(function (data) {
                updatePlayerHistoryDisplay();
            })
            .catch(function (err) {
                alert("Something went wrong :(");
            });
    }

    /**
     * Call to the API and get an updated win/loss record
     */
    function updatePlayerHistoryDisplay() {

        apiService.getPlayerRecord(vm.playerId)
            .then(function (data) {
                vm.playerRecord.wins = data.wins || 0;
                vm.playerRecord.losses = data.losses || 0;
            })
            .catch(function (err) {
                alert("Something went wrong :(");
            });
    }
}
