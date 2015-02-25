'use strict';

var React = require('react');

var style = {
    'stroke-width': "10",
    'stroke-linecap': "round",
    'stroke': "black"
};

var Range = React.createClass({
    render: function(){

        return (
            <line
                x1={this.props.x1}
                x2={this.props.x2}
                y1={this.props.y}
                y2={this.props.y}
                style={style}
            />
        );
    }
});

module.exports = Range;