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

// translation for gCountry
var trans = [0, 0];
// TODO compute responsive behavior
// projection for countries
var projection = d3.geo.stereographic()
    .scale(1600)
    .center([35, 50])
    .translate([w / 2, h / 2]);
// simplify shapes
var simplify = function (area) {
    return d3.geo.transform({
        point: function (x, y, z) {
            if (z >= area) {
                var coords = projection([x, y]);
                this.stream.point(coords[0], coords[1]);
            }
        }
    });
};

// drag on map
var coordDrag;
// TODO constrain drag
// TODO reduce quality on drag to improve perfs
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
    .on('dragend', function () {
        trans = [
            trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
            trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
        ];
    });

function init(datajson) {

    dataTopojson = datajson;

    console.log(datajson);

    svgMap = d3.select('#map').append('svg')
        .attr('class', 'svg-map')
        .call(dragMap);

    gCountry = svgMap.append('g')
        .attr('class', 'g-country')
        .attr('transform', 'translate(' + trans + ')');
};

function render() {

    var path = d3.geo.path()
        .projection(simplify(.1));

    var countries = gCountry.selectAll('.country').data(topojson.feature(dataTopojson, dataTopojson.objects.countries).features);
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