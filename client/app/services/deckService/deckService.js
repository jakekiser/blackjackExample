(function () {

    var myModule = angular.module('deckService', []);

    myModule.factory('deckService', function() {

        var currentDeck = getDeck();

        /**
         * Tracks the current players hands and whether the game is in progress
         * @type {{dealerCards: Array, playerCards: Array, inProgress: boolean}}
         */
        var gameState = {
            dealerCards:[],
            playerCards:[],
            inProgress: false
        };

        /**
         * Create a deck
         * @returns {Array}
         */
        function getDeck() {
            var ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
            var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];

            var deck = [];

            _.each(suits, function(suit) {
                _.each(ranks, function(rank) {
                    deck.push({
                        "suit": suit,
                        "rank": rank
                    })
                });
            });

            return _.shuffle(deck);
        }

        /**
         * Add a card to the players hand
         */
        function hitPlayer() {
            gameState.playerCards.push(currentDeck[0]);
            currentDeck.shift();
        }

        /**
         * Add a card to the dealers hand
         */
        function hitDealer() {
            gameState.dealerCards.push(currentDeck[0]);
            currentDeck.shift();
        }

        /**
         * Init the game and give the player/dealer 2 cards
         */
        function startNewGame() {
            resetGame();
            hitDealer();
            hitPlayer();
            hitDealer();
            hitPlayer();
            gameState.inProgress = true;
        }

        /**
         * Calculate and return the players score based on the cards in their hand
         * @returns {*}
         */
        function getPlayerScore() {
            return calculateScore(gameState.playerCards);
        }

        /**
         * Calculate and return the players score based on the cards in their hand
         * @returns {*}
         */
        function getDealerScore() {
            return calculateScore(gameState.dealerCards);
        }

        /**
         * Calculate a score based on hand value
         * @param hand
         * @returns {number}
         */
        function calculateScore(hand) {
            var score = 0;
            _.each(hand, function(card) {
                score += getScoreFromRank(card.rank);
            });
            return score;
        }

        /**
         * Run the dealers turns and return a winner
         * @returns {*}
         */
        function getWinner() {
            var playerScore = getPlayerScore();
            if (playerScore > 21) return "Dealer";

            while(getDealerScore() < 17) {
                hitDealer();
            }

            var dealerScore = calculateScore(gameState.dealerCards);

            if (dealerScore > 21) return "Player";
            if (dealerScore <= playerScore) {
                return "Player"
            }
            return "Dealer";
        }

        /**
         * Turn the card rank into a numeric value
         * @param rank
         * @returns {*}
         */
        function getScoreFromRank(rank) {
            if (rank === "Ace") return 11;
            if (rank === "Jack" || rank === "Queen" || rank === "King") return 10;
            return parseInt(rank);
        }

        /**
         * Reset the state values
         */
        function resetGame() {
            currentDeck = getDeck();
            gameState.dealerCards = [];
            gameState.playerCards = [];
        }

        return {
            gameState: gameState,
            hitDealer: hitDealer,
            hitPlayer: hitPlayer,
            startNewGame: startNewGame,
            getPlayerScore: getPlayerScore,
            getDealerScore: getDealerScore,
            getWinner: getWinner
        };
    });

})();