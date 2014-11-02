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
        });

    function setup(scope, element, data){
        var $container,
            container,
            svgMap,
            gCountry,
            gOtherCountry,
            $svgMap;
        container = element[0];
        $container =  $(container);
        // create svg
        svgMap = d3.select(container).append('svg')
            .attr('class', 'd3-svg svg-map');
        $svgMap = $('.svg-map');

        // add g
        gOtherCountry = svgMap.append('g')
            .attr('class', 'g-other-country');
        gCountry = svgMap.append('g')
            .attr('class', 'g-country');

    };

    function draw(){

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