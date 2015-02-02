/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';
var P = require('bluebird');
var d3 = require('d3');
var topojson = require('topojson');

var promise = new P(function (resolve) {
    d3.json('data/topo/world-50m.json', function (data) {
        // compute important arcs
        var presimplified = topojson.presimplify(data);

        // TODO normalized all countries
        // all "MultiPolygon" country are divided into "Polygon"
        // each "Polygon" will be considered as a specific country

        // TODO remove too small pieces without neighbour

        // TODO remove too far countries



        resolve(presimplified);
    });
});


module.exports = promise;