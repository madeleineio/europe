/**
 * Created by nicolasmondon on 17/01/15.
 */


// dependencies
var d3 = require('d3/d3');
var topojson = require('topojson/topojson');
var $ = require('jquery/dist/jquery');
var _ = require('underscore/underscore');
var Backbone = require('backbone');
Backbone.Stickit = require('backbone.stickit/backbone.stickit');
var Q = require('q/q');

var template = require('templates/map');
var getData = require('services/get-data');

console.log(Backbone.Stickit);

// style
require('imports?d3=d3!d3-geo-projection/d3.geo.projection');
require('map.scss');

//
var dataTopojson;
var dataTimeline;

//
var MapView = Backbone.View.extend({
    el: $('.map').get(0),
    bindings: {
        ':el': {
            observe: 'title',
            update: function(){
                console.log('title updated');
            }
        }
    },
    template: template,
    initialize: function(){
        Q.all([getData.dataTopojson, getData.dataTimeline]).then(function(d){
            dataTopojson = d[0];
            dataTimeline = d[1];
        });
        this.$el.html(this.template(this.model.toJSON()));
    },
    render: function(){

        this.stickit();
    }
});

module.exports = MapView;