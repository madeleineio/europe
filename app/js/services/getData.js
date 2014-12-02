/**
 * Created by nmondon on 02/12/2014.
 */


'use strict';

var EuroConstr = require('euroConstr');
var d3 = require('d3/d3');

module.exports = EuroConstr.factory('getDataFactory', ['$q', function($q){

    var factory;
    var promiseTopojson, promiseCsv;

    promiseTopojson = $q(function(resolve){
        d3.json('data/topo/world-50m.json', resolve);
    });

    promiseCsv = $q(function(resolve){
        d3.csv('data/UEvsOTAN.csv', resolve);
    });

    factory = {
        topojson: promiseTopojson,
        csv: promiseCsv
    };

    return factory;
}]);