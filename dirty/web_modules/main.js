/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

// style
require('reset.scss');

// vendors
var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var P = require('bluebird');

// services
var promiseGeojson = require('services/get-json-map');
var promiseData = require('services/get-csv-data');

// components
var map = require('components/map');

// retrieve data
P.all([
    promiseData,
    promiseGeojson
]).then(function(d){
    map.init(d[1]);
    map.render();
});