/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';

var EuroConstr = require('../EuroConstr');
var d3 = require('d3/d3');

EuroConstr.directive('d3Test', ['$document', function($document){

    return {
        restrict: 'E',
        link: function(scope, element){
            console.log(d3);
        }
    };
}]);