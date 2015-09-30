'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.blackjack'           // Newly added home module
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/blackjack'
    });
}]);