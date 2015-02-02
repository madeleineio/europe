/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

// style
require('map.scss');

var d3 = require('d3');
var topojson = require('topojson');
var $ = require('jquery');
var _ = require('lodash');


var $container = $('#map');
var w = $container.width(),
    h = $container.height();
var svgMap;
var gCountry;
var dataTopojson;


var trans = [0, 0];
var projection = d3.geo.stereographic()
    .scale(1600)
    .center([-5, 55])
    .translate([w/2, h/2])
    .clipAngle(180 - 1e-4)
    .clipExtent([[0, 0], [w, h]])
    .precision(.1);

var simplify = d3.geo.transform({
    point: function(x, y, z) {
        if (z >= .05){
            var coords = projection([x,y]);
            this.stream.point(coords[0], coords[1]);
        }
    }
});


// drag
var coordDrag;
var dragMap = d3.behavior.drag()
    .on('dragstart', function () {
        coordDrag = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
    })
    .on('drag', function () {
        if (coordDrag) {
            gCountry.attr('transform', 'translate(' + [
                trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
                trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
            ] + ')');
        }
    })
    .on('dragend', function(){
        trans = [
            trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
            trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
        ];
    });

function init(datajson) {
    dataTopojson = datajson;

    svgMap = d3.select('#map').append('svg')
        .attr('class', 'svg-map')
        .call(dragMap);

    gCountry = svgMap.append('g')
    .attr('transform', 'translate(' + trans + ')');
};

function render() {

    var path = d3.geo.path()
        .projection(simplify);

    // compute the importance of each point
    var topoSimple = topojson.presimplify(dataTopojson);

    var countries = gCountry.selectAll('.country').data(topojson.feature(topoSimple, topoSimple.objects.countries).features);
    countries.enter().append('path')
        .attr('class', 'country')
        .attr('id', function (country) {
            return country.id;
        })
        .attr('d', path)
        .style('stroke', 'black');
};

module.exports = {
    init: init,
    render: render
};