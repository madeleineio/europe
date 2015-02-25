'use strict';

var React = require('react');

var YearLines = React.createClass({
    render: function(){
        return (
            <g>
                {this.props.years.map(function (year, k) {
                    return (
                        <line className="pick"
                            key={k}
                            x1={this.props.scaleYear(year)}
                            x2={this.props.scaleYear(year)}
                            y1={this.props.h / 2}
                            y2={this.props.h / 2 - (year % 5 === 0 ? 5 : 3)}/>
                    );
                }, this)}
            </g>
        )
    }
});

module.exports = YearLines;