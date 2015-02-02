 /**
 * Created by nicolasmondon on 17/01/15.
 */


// dependencies
var d3 = require('d3/d3');
var topojson = require('topojson/topojson');
var $ = require('jquery/dist/jquery');
var _ = require('underscore/underscore');
var Backbone = require('backbone');
!Backbone.Stickit && (Backbone.Stickit = require('backbone.stickit/backbone.stickit'));
var Q = require('q/q');

var template = require('templates/map');
var getData = require('services/get-data');

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

    },
    events: {
        'click .country': 'clickCountry'
    },
    template: template,
    initialize: function(){
        Q.all([getData.dataTopojson, getData.dataTimeline]).then(function(d){
            dataTopojson = d[0];
            dataTimeline = d[1];
            this.render();
        }.bind(this));
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        var w = this.$('.svg-map').width();
        var h = this.$('.svg-map').height();
        var projection = d3.geo.stereographic()
            .scale(1600)
            .center([-5, 55])
            .translate([w/2, h/2])
            .rotate([-20, 0])
            .clipAngle(180 - 1e-4)
            .clipExtent([[0, 0], [w, h]])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection);
        var gCountry = d3.select('.g-country');
        var countries = gCountry.selectAll('.country').data(topojson.feature(dataTopojson, dataTopojson.objects.countries).features.filter(function(country){
            return _.find(dataTimeline, function(data){ return parseInt(data.ID) === country.id; });
        }));
        countries.enter().append('path')
            .attr('class', 'country')
            .attr('id', function(country){
                return country.id;
            })
            .attr('d', path);

        this.stickit();
    },
    clickCountry: function(){
        alert('clic');
    }
});

module.exports = MapView;