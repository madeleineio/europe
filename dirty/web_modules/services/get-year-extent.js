/**
 * Created by nicolasmondon on 03/02/15.
 */

'use script';

var d3 = require('d3');
var _ = require('lodash');

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

module.exports = compute;