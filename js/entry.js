/**
 * Created by nicolasmondon on 28/10/2014.
 */

'use strict';

// modules
var d3 = require('../bower_components/d3/d3.js'),
    topojson = require('../bower_components/topojson/topojson.js'),
    $ = require('../bower_components/jquery/dist/jquery.js'),
    Q = require('../node_modules/q/q.js');

// style
require('../css/style.css');

// vars
var topojsonDatas,
    countryDatas,
    promiseTopojson = Q.Promise(function (resolve) {
        d3.json('public/data/topo/world-50m.json', resolve);
    }),
    promiseData = Q.Promise(function (resolve) {
        d3.csv('public/data/UEvsOTAN.csv', resolve);
    }),
    svgMap,
    $svgMap;

// retrieve datas
Q.all([promiseTopojson, promiseData]).then(function (data) {
    topojsonDatas = data[0];
    countryDatas = data[1];

    // create svg
    svgMap = d3.select('.container').append('svg')
        .attr('class', 'd3-svg svg-map');
    $svgMap = $('.svg-map');

    draw();

});

function draw() {
    var w, h, projection, path;
    var countries;

    // size
    w = $svgMap.width();
    h = $svgMap.height();
    // projection
    projection = d3.geo.conicConformal()
        .scale(1000)
        .center([1, 46.5])
        .rotate([-2, 0])
        .parallels([30, 50])
        .translate([w/2, h/2]);
    // path
    path = d3.geo.path()
        .projection(projection);

    countries = svgMap.selectAll('.country').data(topojson.feature(topojsonDatas, topojsonDatas.objects.countries.filter(function(c){

    })).features);
    countries.enter().append('path')
        .attr('class', 'country')
        .attr('d', path);

};

