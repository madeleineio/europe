'use strict';

var React = require('react');

var getYearRange = require('util/get-year-range');

var style = {
    'stroke-width': '8',
    'stroke-linecap': 'round',
    'stroke': 'black'
};

var Range = React.createClass({
    render: function(){
        var years = getYearRange(this.props.currentYear, this.props.yearExtent).map(function(y){
            return this.props.scaleYear(y);
        }, this);

        return (
            <line
                x1={years[0]}
                x2={years[1]}
                y1={this.props.y}
                y2={this.props.y}
                style={style}
            />
        );
    }
});

module.exports = Range;