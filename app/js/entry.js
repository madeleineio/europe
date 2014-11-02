/**
 * Created by nicolasmondon on 28/10/2014.
 */

'use strict';

// modules
var d3 = require('../../bower_components/d3/d3.js'),
    topojson = require('../../bower_components/topojson/topojson.js'),
    $ = require('../../bower_components/jquery/dist/jquery.js'),
    Q = require('../../node_modules/q/q.js'),
    _ = require('../../node_modules/lodash/lodash.js');

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
    svgMap, gCountry, gOtherCountry,
    $svgMap;

// retrieve datas
Q.all([promiseTopojson, promiseData]).then(function (data) {
    topojsonDatas = data[0];
    countryDatas = data[1];

    // create svg
    svgMap = d3.select('.container').append('svg')
        .attr('class', 'd3-svg svg-map');
    $svgMap = $('.svg-map');

    // add g
    gOtherCountry = svgMap.append('g')
        .attr('class', 'g-other-country');
    gCountry = svgMap.append('g')
        .attr('class', 'g-country');

    draw();

});

function draw() {
    var w, h, projection, path;
    var countries, otherCountries;

    // size
    w = $svgMap.width();
    h = $svgMap.height();
    // projection
    projection = d3.geo.conicConformal()
        .scale(800)
        .center([1, 46.5])
        .rotate([-2, 0])
        .parallels([30, 50])
        .translate([w/2, h/2]);
    // path
    path = d3.geo.path()
        .projection(projection);

    countries = gCountry.selectAll('.country').data(topojson.feature(topojsonDatas, topojsonDatas.objects.countries).features.filter(function(country){
        return _.find(countryDatas, function(data){ return parseInt(data.ID) === country.id; });
    }));
    countries.enter().append('path')
        .attr('class', 'country')
        .attr('id', function(country){
            return country.id;
        })
        .attr('d', path);

    otherCountries = gOtherCountry.selectAll('.country').data(topojson.feature(topojsonDatas, topojsonDatas.objects.countries).features.filter(function(country){
        return !_.find(countryDatas, function(data){ return parseInt(data.ID) === country.id; });
    }));
    otherCountries.enter().append('path')
        .attr('class', 'other-country')
        .attr('id', function(country){
            return country.id;
        })
        .attr('d', path);

};