'use strict';

// style
require('timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');

var Cursor = require('components/timeline/cursor');
var YearLines = require('components/timeline/year-lines');
var YearLabels = require('components/timeline/year-labels');
var Range = require('components/timeline/range');

var marginX = 60;
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
                    <YearLines
                        h={h}
                        years={years}
                        scaleYear={scaleXYear}
                    />
                    <YearLabels
                        h={h}
                        years={years}
                        scaleYear={scaleXYear}
                    />
                    <Range
                        y={h / 2 + 10}
                        currentYear={this.props.currentYear}
                        yearExtent={this.props.yearExtent}
                        scaleYear={scaleXYear}
                    />
                    <Cursor size={5}
                        y={h / 2 + 5}
                        constrain={[marginX, w - marginX]}
                        currentYear={this.props.currentYear}
                        yearExtent={this.props.yearExtent}
                        setCurrentYear={this.props.setCurrentYear}/>
                </svg>
            </div>
        );
    }
});