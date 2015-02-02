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
var dataTopojson;


var trans = [w/2, h/2];

var projection = d3.geo.stereographic()
    .scale(1600)
    .center([-5, 55])
    .rotate([-20, 0])
    .clipAngle(180 - 1e-4)
    .clipExtent([[0, 0], [w, h]])
    .precision(.1);

var simplify = function(trans){
    return d3.geo.transform({
        point: function(x, y, z) {
            if (z >= .2){
                var coords = projection.translate(trans)([x,y]);
                this.stream.point(coords[0], coords[1]);
            }
        }
    });
};


// drag
var coordDrag;
var dragMap = d3.behavior.drag()
    .on('dragstart', function () {
        coordDrag = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
    })
    .on('drag', function () {
        if (coordDrag) {
            var path = d3.geo.path()
                .projection(simplify([
                    w / 2 + d3.event.sourceEvent.pageX - coordDrag[0],
                    h / 2 + d3.event.sourceEvent.pageY - coordDrag[1]
                ]));
            d3.selectAll('path').attr('d', path);
        }
    });

function init(datajson) {
    dataTopojson = datajson;

    svgMap = d3.select('#map').append('svg')
        .attr('class', 'svg-map')
        .call(dragMap);
};

function render() {

    var path = d3.geo.path()
        .projection(simplify(trans));

    // compute the importance of each point
    var topoSimple = topojson.presimplify(dataTopojson);


    var countries = svgMap.selectAll('.country').data(topojson.feature(topoSimple, topoSimple.objects.countries).features);
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