/**
 * Created by nicolasmondon on 17/01/15.
 */

var Q = require('q/q');
var d3 = require('d3/d3');

var promiseCSV = Q.Promise(function(resolve){
    d3.json('data/topo/world-50m.json', resolve);
});
var promiseTopojson = Q.Promise(function(resolve){
    d3.csv('data/UEvsOTAN.csv', resolve);
});

module.exports = {
    topojson: promiseTopojson,
    csv: promiseCSV
};