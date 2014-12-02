/**
 * Created by nmondon on 02/12/2014.
 */

'use strict';

// modules
var EuroConstr = require('euroConstr'),
    d3 = require('d3/d3'),
    topojson = require('topojson/topojson'),
    $ = require('jquery/dist/jquery'),
    _ = require('lodash/lodash');

require('timeline.scss');

module.exports = EuroConstr.directive('d3Timeline', ['$document', '$q', 'getDataFactory', 'getYearExtentFactory', function($document, $q, getDataFactory, getYearExtentFactory){

    var topojsonDatas,
        csvDatas,
        yearExtent;
    var $parent,
        container,
        svg,
        gTimeline,
        gCursor,
        $svg;

    function setup(scope, element, data){
        topojsonDatas  = data[0];
        csvDatas = data[1];
        yearExtent = getYearExtentFactory(csvDatas);
        container = element[0];
        $parent = $(container).parent();
        svg = d3.select(container).append('svg')
            .attr('class', 'd3-svg svg-timeline');
        $svg = $('.svg-timeline');
        gTimeline = svg.append('g');
        gCursor = svg.append('g');
        draw();
    };

    function draw(){
        var w, h, marginWidth;
        var years, cursor, line, picks;

        w = $svg.width();
        h = $svg.height();
        marginWidth = 50;

        line = gTimeline.selectAll('.line').data([1]);
        line.exit().remove();
        line.enter().append('line')
            .attr('class', 'line')
            .attr('x1', marginWidth)
            .attr('x2', w - marginWidth)
            .attr('y1', 50)
            .attr('y2', 50)
            .style('stroke', 'black')
            .style('shape-rendering', 'crispEdges');


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

