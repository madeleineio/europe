'use strict';

var React = require('react');
var _ = require('lodash');

var styleLine = {
    stroke: 'rgb(37, 37, 194)'
};

var UEStrip = React.createClass({
    componentWillMount: function(){
        _.extend(styleLine, {
            strokeWidth: this.props.height / 2,
            mask: 'url(#' + this.props.mask + ')'
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

module.exports = UEStrip;