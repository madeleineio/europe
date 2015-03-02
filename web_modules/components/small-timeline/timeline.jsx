'use strict';

require('small-timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var getYearRange = require('util/get-year-range');

var math = require('util/math');

var styleVerticalLine = {
    stroke: 'black'
};

/**
 * @props currentYear
 * @props yearExtent
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {

        // .6 because svg is 60% of width
        var w = .6 * $(window).width() / 2;
        var h = 100;

        var yearRange = getYearRange(this.props.currentYear, this.props.yearExtent);

        var scaleXYear = d3.scale.linear()
            .domain(yearRange)
            .rangeRound([0, w]);

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
                        return y % 10 === 0
                    }).map(function (year, k) {
                        return (
                            <text className="year" x={scaleXYear(year)} y={h / 2 - 10} key={k}>
                                {year}
                            </text>
                        );
                    })}
                    <line
                        x1={scaleXYear(this.props.currentYear)}
                        x2={scaleXYear(this.props.currentYear)}
                        y1={0}
                        y2={1000}
                        style={styleVerticalLine}
                    />
                </svg>
            </div>
        );
    }
});