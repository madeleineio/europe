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

module.exports = EuroConstr.directive('d3Timeline', [
    '$document',
    '$q',
    'getDataFactory',
    'getYearExtentFactory',
    'getCursorFactory',
    'getLosangeFactory',
    'getStripeLineFactory',
    'getCursorFilterFactory',
    'mathUtilFactory',
    function ($document,
              $q,
              getDataFactory,
              getYearExtentFactory,
              getCursorFactory,
              getLosangeFactory,
              getStripeLineFactory,
              getCursorFilterFactory,
              mathUtilFactory) {

        var topojsonDatas,
            csvDatas,
            yearDatas,
            yearExtent;
        var $parent,
            container,
            svg,
            defs, idCursorFilter,
            gTimeline,
            gCursor,
            gCountry,
            $svg;

        function setup(scope, element, data) {
            // setup datas
            topojsonDatas = data[0];
            csvDatas = data[1];
            yearExtent = getYearExtentFactory(csvDatas);
            yearDatas = d3.range(yearExtent[0], yearExtent[1] + 1);
            // setup svg
            container = element[0];
            $parent = $(container).parent();
            svg = d3.select(container).append('svg')
                .attr('class', 'd3-svg svg-timeline');
            defs = svg.append('defs');
            idCursorFilter = 'cursorFilter'
            getCursorFilterFactory(defs, idCursorFilter);
            $svg = $('.svg-timeline');
            gTimeline = svg.append('g')
                .attr('class', 'g-timeline');
            gCursor = svg.append('g')
                .attr('class', 'g-cursor');
            gCountry = svg.append('g')
                .attr('class', 'g-country');
            // launch draw
            draw();
        };

        function draw() {
            // var declaration
            var w, h, yearMarginLeftWidth;
            var yearXLeft, yearXRight;
            var lineY, pickYBottom, pickYTop, pickYTop10, yearYBottom;
            var cursorCenter, cursorSize, cursorDrag;
            var years, cursor, line, picks,
                countryLineG, countryLabel,
                countryLineHeight,
                countryLabelMarginLeft,
                countryThinLine, countryEmptyLine, countryOtanLine, countryUELine,
                countryUEStripe, countryPPPStripe,
                countryUEPoint,
                countryCandidatureUEPoint, countryPPPPoint, countryOtanPoint;
            var yearXScale, countryLineYScale;

            // sizes
            w = $svg.width();
            h = $svg.height();
            yearMarginLeftWidth = 200;
            yearXLeft = yearMarginLeftWidth;
            yearXRight = w;
            lineY = 50;
            pickYBottom = lineY - 2;
            pickYTop = pickYBottom - 3;
            pickYTop10 = pickYBottom - 5;
            yearYBottom = pickYTop10 - 5;
            cursorCenter = [yearXLeft, lineY];
            cursorSize = 4;
            countryLineHeight = 20;
            countryLabelMarginLeft = 20;

            // scales
            yearXScale = d3.scale.linear()
                .domain(yearExtent)
                .range([yearXLeft, yearXRight]);

            countryLineYScale = d3.scale.linear()
                .domain([-1, csvDatas.length])
                .range([lineY, lineY + csvDatas.length * countryLineHeight]);

            // line
            line = gTimeline.selectAll('.line').data([1]);
            line.exit().remove();
            line.enter().append('line')
                .attr('class', 'line')
                .attr('x1', yearXLeft)
                .attr('x2', yearXRight)
                .attr('y1', lineY)
                .attr('y2', lineY);

            // picks
            function getY2Pick(year) {
                return (year % 10 === 0 ? pickYTop10 : pickYTop);
            };
            picks = gTimeline.selectAll('.pick').data(yearDatas);
            picks.enter().append('line')
                .attr('class', 'pick')
                .attr('x1', yearXScale)
                .attr('x2', yearXScale)
                .attr('y1', pickYBottom)
                .attr('y2', getY2Pick);

            // years
            // we only display years % 10
            years = gTimeline.selectAll('.year').data(yearDatas.filter(function (year) {
                return year % 10 === 0;
            }));
            years.enter().append('text')
                .attr('class', 'year')
                .attr('x', yearXScale)
                .attr('y', yearYBottom)
                .text(function (year) {
                    return year;
                });

            // cursor
            cursorDrag = d3.behavior.drag()
                .on('dragstart', dragCursorStarted)
                .on('drag', draggedCursor)
                .on('dragend', dragCursorEnded);
            function dragCursorStarted(d) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed('dragging', true);
            };
            function draggedCursor(d) {
                d3.select(this).attr('points', getCursorFactory([
                            mathUtilFactory.constrain(d3.event.x, yearXLeft, yearXRight),
                            lineY], cursorSize));
            };
            function dragCursorEnded(d) {
                d3.select(this).classed('dragging', false);
            };
            cursor = gCursor.selectAll('.cursor').data([1]);
            cursor.enter().append('polygon')
                .attr('class', 'cursor')
                .attr('points', getCursorFactory(cursorCenter, cursorSize))
                .style('filter', 'url(#' + idCursorFilter + ')')
                .call(cursorDrag);

            // g country line
            countryLineG = gCountry.selectAll('.country-line-g').data(csvDatas);
            countryLineG.enter().append('g')
                .attr('class', 'country-line-g')
                .attr('transform', function(country, i){
                    return 'translate(' + [0, countryLineYScale(i)] + ')';
                });

            console.log(csvDatas);

            countryThinLine = countryLineG.selectAll('.thin-line').data(function(country){
                return [1];
            });
            countryThinLine.enter().append('line')
                .attr('class', 'thin-line')
                .attr('x1', countryLabelMarginLeft)
                .attr('x2', yearXRight)
                .attr('y1', countryLineHeight / 2)
                .attr('y2', countryLineHeight / 2);

            countryEmptyLine = countryLineG.selectAll('.empty-line').data(function(country){
                return [1];
            });
            countryEmptyLine.enter().append('line')
                .attr('class', 'empty-line')
                .attr('x1', yearXLeft)
                .attr('x2', yearXRight)
                .attr('y1', countryLineHeight / 2)
                .attr('y2', countryLineHeight / 2);

            countryOtanLine = countryLineG.selectAll('.otan-line').data(function(country){
                return [country.OTAN];
            });
            countryOtanLine.enter().append('line')
                .attr('class', 'otan-line')
                .attr('x1', function(d){
                    var year = parseInt(d);
                    if($.isNumeric(year)){
                        return yearXScale(year);
                    }else {
                        return yearXRight;
                    }
                })
                .attr('x2', yearXRight)
                .attr('y1', countryLineHeight / 2)
                .attr('y2', countryLineHeight / 2);

            countryUELine = countryLineG.selectAll('.ue-line').data(function(country){
                return [country.UE];
            });
            countryUELine.enter().append('line')
                .attr('class', 'ue-line')
                .attr('x1', function(d){
                    var year = parseInt(d);
                    if($.isNumeric(year)){
                        return yearXScale(year);
                    }else {
                        return yearXRight;
                    }
                })
                .attr('x2', yearXRight)
                .attr('y1', countryLineHeight / 2)
                .attr('y2', countryLineHeight / 2);

            countryUEStripe = countryLineG.selectAll('.ue-stripe').data(function(country){
                var yearStart = parseInt(country['candidature officielle']);

                if(!$.isNumeric(yearStart)) return [];
                var yearEnd = $.isNumeric(parseInt(country.UE)) ? parseInt(country.UE) : yearExtent[1] ;

                return getStripeLineFactory(
                    yearXScale(yearStart),
                    yearXScale(yearEnd),
                    countryLineHeight / 2,
                    1,
                    4
                );
            });
            countryUEStripe.enter().append('line')
                .attr('class', 'ue-stripe')
                .attr('x1', function(d){
                    return d[0][0];
                })
                .attr('x2', function(d){
                    return d[1][0];
                })
                .attr('y1', function(d){
                    return d[0][1];
                })
                .attr('y2', function(d){
                    return d[1][1];
                });

            countryPPPStripe = countryLineG.selectAll('.ppp-stripe').data(function(country){
                var yearStart = parseInt(country.PPP);

                if(!$.isNumeric(yearStart)) return [];
                var yearEnd = $.isNumeric(parseInt(country.OTAN)) ? parseInt(country.OTAN) : yearExtent[1] ;

                return getStripeLineFactory(
                    yearXScale(yearStart),
                    yearXScale(yearEnd),
                    countryLineHeight / 2,
                    -1,
                    4
                );
            });
            countryPPPStripe.enter().append('line')
                .attr('class', 'ppp-stripe')
                .attr('x1', function(d){
                    return d[0][0];
                })
                .attr('x2', function(d){
                    return d[1][0];
                })
                .attr('y1', function(d){
                    return d[0][1];
                })
                .attr('y2', function(d){
                    return d[1][1];
                });



            countryUEPoint = countryLineG.selectAll('.ue-point').data(function(country){
                var year = parseInt(country.UE);
                return $.isNumeric(year) ? [year] : [];
            });
            countryUEPoint.enter().append('circle')
                .attr('class', 'ue-point')
                .attr('cx', function(d){
                    return yearXScale(d);
                })
                .attr('cy', countryLineHeight / 2)
                .attr('r', 2.5);

            //
            countryCandidatureUEPoint = countryLineG.selectAll('.candidature-ue-point').data(function(country){
                var year = parseInt(country['candidature officielle']);
                return $.isNumeric(year) ? [year] : [];
            });
            countryCandidatureUEPoint.enter().append('circle')
                .attr('class', 'candidature-ue-point')
                .attr('cx', function(d){
                    return yearXScale(d);
                })
                .attr('cy', countryLineHeight / 2)
                .attr('r', 2.5);

            countryPPPPoint = countryLineG.selectAll('.ppp-point').data(function(country){
                return [country.PPP];
            });
            countryPPPPoint.enter().append('polygon')
                .attr('class', 'ppp-point')
                .attr('points', function(d){
                    var year = parseInt(d);
                    if($.isNumeric(year)){
                        return getLosangeFactory([yearXScale(year), countryLineHeight / 2], 3);
                    }else {
                        return '';
                    }
                });

            countryOtanPoint = countryLineG.selectAll('.otan-point').data(function(country){
                return [country.OTAN];
            });
            countryOtanPoint.enter().append('polygon')
                .attr('class', 'otan-point')
                .attr('points', function(d){
                    var year = parseInt(d);
                    if($.isNumeric(year)){
                        return getLosangeFactory([yearXScale(year), countryLineHeight / 2], 3);
                    }else {
                        return '';
                    }
                });



            countryLabel = countryLineG.selectAll('.label').data(function(country){
                return [country.nom];
            });
            countryLabel.enter().append('text')
                .attr('class', 'label')
                .attr('x', countryLabelMarginLeft)
                .attr('y', countryLineHeight / 2)
                .text(function(d){ return d;});

        };

        return {
            restrict: 'E',
            link: function (scope, element) {
                $q.all([getDataFactory.topojson, getDataFactory.csv]).then(function (data) {
                    setup(scope, element, data);
                });
            }
        };

    }]);

