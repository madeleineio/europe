/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';

var EuroConstr = require('euroConstr'),
    d3 = require('d3/d3'),
    topojson = require('topojson/topojson'),
    $ = require('jquery/dist/jquery'),
    _ = require('lodash/lodash');

require('imports?d3=d3!d3-geo-projection/d3.geo.projection');
require('map.scss');

EuroConstr.directive('d3Map', ['$document', '$q', 'getDataFactory', function($document, $q, getDataFactory){

    var topojsonDatas,
        countryDatas,
        $parent,
        container,
        svgMap,
        gCountry,
        gOtherCountry,
        gStrokeCountry,
        gRoundedStrokeCountry,
        $svgMap;

    function setup(scope, element, data){
        topojsonDatas = data[0];
        countryDatas = data[1];

        container = element[0];
        $parent =  $(container).parent();
        // create svg
        svgMap = d3.select(container).append('svg')
            .attr('class', 'd3-svg svg-map');
        $svgMap = $('.svg-map');

        // add g
        gOtherCountry = svgMap.append('g')
            .attr('class', 'g-other-country');
        gCountry = svgMap.append('g')
            .attr('class', 'g-country');
        gStrokeCountry = svgMap.append('g')
            .attr('class', 'g-stroke-country');
        gRoundedStrokeCountry = svgMap.append('g')
            .attr('class', 'g-rounded-stroke-country');

        draw();

    };

    function draw(){
        var w, h, projection, path;
        var countries, otherCountries, strokeCountries, roundedStrokeCountries;

        // size
        w = $svgMap.width();
        h = $svgMap.height();
        // projection
        /*projection = d3.geo.conicConformal()
            .scale(800)
            .center([1, 46.5])
            .rotate([-2, 0])
            .parallels([30, 50])
            .translate([w/2, h/2]);*/
        /*projection = d3.geo.robinson()
            .scale(800)
            .center([10, 56.5])
            .translate([w / 2, h / 2])
            .precision(.1);*/
        projection = d3.geo.stereographic()
            .scale(1600)
            .center([-5, 55])
            .translate([w / 2, h / 2])
            .rotate([-20, 0])
            .clipAngle(180 - 1e-4)
            .clipExtent([[0, 0], [w, h]])
            .precision(.1);
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


    };

    return {
        restrict: 'E',
        link: function(scope, element){
            $q.all([getDataFactory.topojson, getDataFactory.csv]).then(function(data){
                setup(scope, element, data);
            });
        }
    };
}]);