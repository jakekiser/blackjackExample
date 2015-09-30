(function () {

    /**
     * A simple service for making calls to the api
     * Normally this would be an encapsulated set up which would be owned by individual services each referring to
     * their own endpoint (Users, Games, ect)
     * @type {module|*}
     */

    var myModule = angular.module('apiService', []);

    myModule.factory('apiService', ['Restangular', function(Restangular) {
        Restangular.setBaseUrl('http://localhost:8080/api');

        return {
            getPlayerRecord: function(playerId) {
                return Restangular.one('history', playerId).get();
            },
            postGameResult: function(gameResult) {
                return Restangular.all('record').post(gameResult);
            }
        };
    }]);

})();