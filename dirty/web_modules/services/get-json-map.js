/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';
var P = require('bluebird');
var d3 = require('d3');
var topojson = require('topojson');
var projection = require('services/get-projection');
var simplify = require('services/get-simplify');

var promise = new P(function (resolve) {
    d3.json('data/topo/world-50m.json', function (data) {
        // compute important arcs
        var presimplified = topojson.presimplify(data);

        // transform all MutliPolygon as an array of Polygon
        // as it, we just have Polygons
        data.objects.countries.geometries = _.flatten(data.objects.countries.geometries.map(function(g){
            // possibly non unique country id : cid
            g.cid = g.id;
            // multi polygons
            if(g.type === 'MultiPolygon'){
                return _.range(g.arcs.length).map(function(p, i){
                    return _.extend({}, g, {
                        type: 'Polygon',
                        arcs: g.arcs[i],
                        // unique id
                        id: g.id + '_' + i
                    });
                });
            }
            // simple polygons
            else return _.extend({}, g, {
                // unique id
                id: g.id + '_0'
            });
        }), true);


        // TODO remove too small pieces without neighbour
        // first, find all polygons without neighbours
        var path = d3.geo.path()
            .projection(simplify(.1, projection));
        var features = topojson.feature(data, data.objects.countries).features;
        var neighbors = topojson.neighbors(data.objects.countries.geometries);
        data.objects.countries.geometries = data.objects.countries.geometries.filter(function(g, i){
            return neighbors[i].length > 0 || path.area(features[i]) > 100;
        });


        // TODO remove too far countries



        resolve(presimplified);
    });
});


module.exports = promise;