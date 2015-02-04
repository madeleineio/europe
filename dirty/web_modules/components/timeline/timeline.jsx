'use strict';

// style
require('timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var marginX = 20;
var w;
var h;

/**
 * @props yearExtent
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {

        var w = $('#timeline').width();
        var h = $('#timeline').height();

        var scaleXYear = d3.scale.linear()
            .domain(this.props.yearExtent)
            .rangeRound([20, w - 20]);

        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);


        return (
            <svg className="svg-timeline">
                <line className="pick"
                    x1={scaleXYear(this.props.yearExtent[0])}
                    x2={scaleXYear(this.props.yearExtent[1])}
                    y1={h / 2 + 3}
                    y2={h / 2 + 3}/>
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
                        <text className="year" x={scaleXYear(year)} y={h/2 - 10}>
                            {year}
                        </text>
                    );
                })}
            </svg>
        );
    }
});