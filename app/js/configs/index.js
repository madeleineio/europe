/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';

var EuroConstr = require('../EuroConstr');

EuroConstr.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        }).otherwise({
            redirectTo: '/home'
        });
}]);
