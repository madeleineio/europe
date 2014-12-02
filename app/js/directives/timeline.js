/**
 * Created by nmondon on 02/12/2014.
 */

'use strict';

// modules
var EuroConstr = require('euroConstr'),
    d3 = require('d3/d3'),
    topojson = require('topojson/topojson'),
    $ = require('jquery/dist/jquery'),
    _ = require('lodash/lodash');

require('timeline.css');

module.exports = EuroConstr.directive('d3Timeline', ['$document', '$q', 'getDataFactory', function($document, $q, getDataFactory){

    function setup(){
    };

    function draw(){

    };

    return {
        restrict: 'E',
        link: function(scope, element){
            setup();
        }
    };

}]);

