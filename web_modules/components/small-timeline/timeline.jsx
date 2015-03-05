'use strict';

require('small-timeline.scss');

var React = require('react');
var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');

var math = require('util/math');

var style = {
    zIndex: 4,
    width: '100%',
    height: '10%',
    position: 'fixed',
    top: 0
};

var styleVerticalLine = {
    stroke: 'black'
};

/**
 * @props currentYear
 * @props yearExtent
 * @type {*|Function}
 */
module.exports = React.createClass({
    componentWillMount: function(){
        // add background color to the style
        _.extend(style, {
            backgroundColor: this.props.backgroundColor
        });
    },
    render: function () {
        var h = 100;

        var years = d3.range(this.props.yearExtent[0], this.props.yearExtent[1] + 1);

        return (
            <div id="small-timeline" style={style}>
                <svg className="svg-small-timeline">
                    <g style={this.props.translateStripes}>
                        {years.map(function (year, k) {
                            return (
                                <line className="pick"
                                    key={k}
                                    x1={this.props.scaleXYear(year)}
                                    x2={this.props.scaleXYear(year)}
                                    y1={h / 2}
                                    y2={h / 2 - (year % 5 === 0 ? 5 : 3)}/>
                            );
                        }, this)}
                        {years.filter(function (y) {
                            return y % 10 === 0
                        }).map(function (year, k) {
                            return (
                                <text className="year" x={this.props.scaleXYear(year)} y={h / 2 - 10} key={k}>
                                    {year}
                                </text>
                            );
                        }, this)}
                        <line
                            x1={this.props.scaleXYear(this.props.currentYear)}
                            x2={this.props.scaleXYear(this.props.currentYear)}
                            y1={0}
                            y2={1000}
                            style={styleVerticalLine}
                        />
                    </g>

                </svg>
            </div>
        );
    }
});