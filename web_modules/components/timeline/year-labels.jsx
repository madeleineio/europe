'use strict';

var React = require('react');

var YearLabels = React.createClass({
    render: function () {
        return (
            <g>
            {this.props.years.filter(function (y, i) {
                return (y % 10 === 0 || i === this.props.years.length - 1)
            }.bind(this)).map(function (year, k) {
                return (
                    <text className="year" x={this.props.scaleYear(year)} y={this.props.h / 2 - 10} key={k}>
                        {year}
                    </text>
                );
            }, this)}
            </g>
        );
    }
});

module.exports = YearLabels;