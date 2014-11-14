/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';

var EuroConstr = require('../EuroConstr'),
    d3 = require('d3/d3'),
    topojson = require('topojson/topojson'),
    $ = require('jquery/dist/jquery'),
    _ = require('lodash/lodash');

require('../../css/map.css');


EuroConstr.directive('d3Map', ['$document', '$q', function($document, $q){

    var topojsonDatas,
        countryDatas,
        promiseTopojson = $q(function(resolve){
            d3.json('data/topo/world-50m.json', resolve);
        }),
        promiseData = $q(function(resolve){
            d3.csv('data/UEvsOTAN.csv', resolve);
        }),
        $parent,
        container,
        svgMap,
        gCountry,
        gOtherCountry,
        gStrokeCountry,
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

        draw();

    };

    function draw(){
        var w, h, projection, path;
        var countries, otherCountries, strokeCountries;

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


        strokeCountries = gStrokeCountry.selectAll('.stroke-country').data([topojson.merge(topojsonDatas, topojsonDatas.objects.countries.geometries.filter(function(country){
            return /*country.id === 250 || */country.id === 616;
        }))]);
        strokeCountries.enter().append('path')
            .attr('class', 'stroke-country')
            .attr('d', path)
            .attr('transform', function(d) {
                var centroid = path.centroid(d),
                    x = centroid[0],
                    y = centroid[1];
                return 'translate(' + [x,y] + ')'
                + 'scale(1.3)'
                + 'translate(' + [-x,-y] + ')';
            })
    };

    return {
        restrict: 'E',
        link: function(scope, element){
            $q.all([promiseTopojson, promiseData]).then(function(data){
                setup(scope, element, data);
            });
        }
    };
}]);