'use strict';

require('small-timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var math = require('util/math');

/**
 * @props currentYear
 * @props yearExtent
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {

        var w = $(window).width() / 2;
        var h = 100;

        /*var firstYearVisible = math.constrain(this.props.currentYear -7.5, this.props.yearExtent[0], this.props.yearExtent[1]);
        var lastYearVisible = math.constrain(firstYearVisible +15, this.props.yearExtent[0], this.props.yearExtent[1]);
        firstYearVisible = lastYearVisible - 15;*/

        var scaleXYear = d3.scale.linear()
            .domain([this.props.currentYear -7.5, this.props.currentYear +7.5])
            .rangeRound([20, w - 20]);

        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);

        return (
            <div id="small-timeline">
                <div className="border-left"></div>
                <svg className="svg-small-timeline">
                    {years.map(function (year, k) {
                        return (
                            <line className="pick"
                                key={k}
                                x1={scaleXYear(year)}
                                x2={scaleXYear(year)}
                                y1={h / 2}
                                y2={h / 2 - (year % 5 === 0 ? 5 : 3)}/>
                        );
                    })}
                    {years.filter(function (y) {
                        return y % 5 === 0
                    }).map(function (year, k) {
                        return (
                            <text className="year" x={scaleXYear(year)} y={h / 2 - 10} key={k}>
                                {year}
                            </text>
                        );
                    })}
                </svg>
            </div>
        );
    }
});