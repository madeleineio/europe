'use strict';

require('script!angular/angular');
require('script!angular-route/angular-route');

var euroConstr = window.angular.module('euroConstr', [
    'ngRoute'
]);

euroConstr.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        }).otherwise({
            redirectTo: '/home'
        });
}]);

euroConstr.controller('InitCtrl', ['$scope', function($scope){
    console.log('hello init');
}]);
euroConstr.controller('HomeCtrl', ['$scope', function($scope){
    console.log('hello home');
}]);