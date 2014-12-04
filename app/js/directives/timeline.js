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
        yearDatas,
        yearExtent;
    var $parent,
        container,
        svg,
        gTimeline,
        gCursor,
        $svg;

    function setup(scope, element, data){
        // setup datas
        topojsonDatas  = data[0];
        csvDatas = data[1];
        yearExtent = getYearExtentFactory(csvDatas);
        yearDatas = d3.range(yearExtent[0], yearExtent[1]+1);
        // setup svg
        container = element[0];
        $parent = $(container).parent();
        svg = d3.select(container).append('svg')
            .attr('class', 'd3-svg svg-timeline');
        $svg = $('.svg-timeline');
        gTimeline = svg.append('g')
            .attr('class', 'g-timeline');
        gCursor = svg.append('g');
        // launch draw
        draw();
    };

    function draw(){
        // var declaration
        var w, h, marginWidthYear;
        var xLeftYear, xRightYear;
        var yLine, yBottomPick, yTopPick, yTopPick10, yBottomYear;
        var years, cursor, line, picks;
        var xScaleYear;

        // sizes
        w = $svg.width();
        h = $svg.height();
        marginWidthYear = 50;
        xLeftYear = marginWidthYear;
        xRightYear = w - marginWidthYear;
        yLine = 50;
        yBottomPick = yLine - 2;
        yTopPick = yBottomPick - 3;
        yTopPick10 = yBottomPick - 5;
        yBottomYear = yTopPick10 - 5;

        // scales
        xScaleYear = d3.scale.linear()
            .domain(yearExtent)
            .range([xLeftYear, xRightYear]);

        // line
        line = gTimeline.selectAll('.line').data([1]);
        line.exit().remove();
        line.enter().append('line')
            .attr('class', 'line')
            .attr('x1', xLeftYear)
            .attr('x2', xRightYear)
            .attr('y1', yLine)
            .attr('y2', yLine);

        // picks
        function getY2Pick(year){
            return (year % 10 === 0 ? yTopPick10 : yTopPick);
        };
        picks = gTimeline.selectAll('.pick').data(yearDatas);
        picks.enter().append('line')
            .attr('class', 'pick')
            .attr('x1', xScaleYear)
            .attr('x2', xScaleYear)
            .attr('y1', yBottomPick)
            .attr('y2', getY2Pick);

        // years
        // we only display years % 10
        years = gTimeline.selectAll('.year').data(yearDatas.filter(function(year){
            return year % 10 === 0;
        }));
        years.enter().append('text')
            .attr('class', 'year')
            .attr('x', xScaleYear)
            .attr('y', yBottomYear)
            .text(function(year){ return year; });

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

