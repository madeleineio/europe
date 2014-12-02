/**
 * Created by nmondon on 02/12/2014.
 */



'use strict';

var EuroConstr = require('euroConstr');
var d3 = require('d3/d3');
var _ = require('lodash/lodash');

module.exports = EuroConstr.factory('getYearExtentFactory', [function(){

    var events = [
        'OTAN', 'PPP', 'UE', 'candidature non officielle', 'candidature officielle'
    ];

    function compute(countries){
        return [
            d3.min(countries, function(country){
                return d3.min(events, function(event){
                    var year = parseInt(country[event]);
                    return _.isNumber(year) ? year : 9999;
                });
            }),
            d3.max(countries, function(country){
                return d3.max(events, function(event){
                    var year = parseInt(country[event]);
                    return _.isNumber(year) ? year : 0;
                });
            })
        ];
    };

    return compute;
}]);