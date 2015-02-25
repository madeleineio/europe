'use strict';

// style
require('timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var Cursor = require('components/timeline/cursor');
var Range = require('components/timeline/range');

var marginX = 100;
var w;
var h;

/**
 * @props yearExtent
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {

        var w = $(window).width() / 2;
        var h = 100;

        var scaleXYear = d3.scale.linear()
            .domain(this.props.yearExtent)
            .rangeRound([marginX, w - marginX]);

        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);

        return (
            <div id="timeline">
                <svg className="svg-timeline">
                    <line className="pick"
                        x1={scaleXYear(this.props.yearExtent[0])}
                        x2={scaleXYear(this.props.yearExtent[1])}
                        y1={h / 2 + 10}
                        y2={h / 2 + 10}/>
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
                    {years.filter(function (y, i) {
                        return (y % 10 === 0 || i === years.length -1)
                    }).map(function (year, k) {
                        return (
                            <text className="year" x={scaleXYear(year)} y={h / 2 - 10} key={k}>
                                {year}
                            </text>
                        );
                    })}
                    <Cursor size={5}
                        y={h / 2 + 5}
                        constrain={[marginX, w - marginX]}
                        currentYear={this.props.currentYear}
                        yearExtent={this.props.yearExtent}
                        setCurrentYear={this.props.setCurrentYear}/>
                    <Range
                        y={h / 2 + 5}
                        x1={scaleXYear(this.props.currentYear - 7)}
                        x2={scaleXYear(this.props.currentYear + 7)}
                    />
                </svg>
            </div>
        );
    }
});