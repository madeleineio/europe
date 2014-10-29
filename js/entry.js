/**
 * Created by nicolasmondon on 28/10/2014.
 */

'use strict';

// modules
var d3 = require('../bower_components/d3/d3.js'),
    topojson = require('../bower_components/topojson/topojson.js'),
    $ = require('../bower_components/jquery/dist/jquery.js'),
    Q = require('../node_modules/q/q.js');

// vars
var topojsonDatas,
    countryDatas,
    promiseTopojson = Q.Promise(function(resolve){
        d3.json('public/data/topo/world-50m.json', resolve);
    }),
    promiseData = Q.Promise(function(resolve){
        d3.csv('public/data/UEvsOTAN.csv', resolve);
    });

// retrieve datas
Q.all([promiseTopojson, promiseData]).then(function(data){
    topojsonDatas = data[0];
    countryDatas = data[1];
});