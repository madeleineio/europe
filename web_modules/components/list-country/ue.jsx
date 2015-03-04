'use strict';

var React = require('react');

var UEStrip = React.createClass({
    render: function(){

        var styleLine = {
            stroke: 'blue',
            strokeWidth: this.props.height
        };

        return (
            <line
                style={styleLine}
                x1={0}
                y1={this.props.height / 2}
                x2={50}
                y2={this.props.height / 2}
            />
        );
    }
});

module.exports = UEStrip;