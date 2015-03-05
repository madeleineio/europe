'use strict';

var React = require('react');
var _ = require('lodash');

var styleLine = {
    stroke: 'rgb(232, 101, 101)'
};


var OTANStrip = React.createClass({
    componentWillMount: function(){
        _.extend(styleLine, {
            strokeWidth: this.props.height
        });
    },
    render: function(){
        return (
            <line
                style={styleLine}
                x1={this.props.scaleXYear(this.props.begin)}
                y1={this.props.height / 2}
                x2={this.props.scaleXYear(this.props.yearExtent[1])}
                y2={this.props.height / 2}
            />
        );
    }
});

module.exports = OTANStrip;