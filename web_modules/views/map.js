/**
 * Created by nicolasmondon on 17/01/15.
 */


// dependencies
var d3 = require('d3/d3');
var topojson = require('topojson/topojson');
var $ = require('jquery/dist/jquery');
var _ = require('underscore/underscore');
var Backbone = require('backbone');
var Q = require('q/q');

var template = require('templates/map');
var getData = require('services/get-data');


// style
require('imports?d3=d3!d3-geo-projection/d3.geo.projection');
require('map.scss');

//
var MapView = Backbone.View.extend({
    el: $('.map').get(0),
    template: template,
    initialize: function(){
        Q.all([getData.topojson, getData.csv]).then(function(d){
            alert('data retrieed');
        });
    },
    render: function(){

    }
});

module.exports = MapView;