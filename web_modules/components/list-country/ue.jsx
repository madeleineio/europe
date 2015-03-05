'use strict';

var React = require('react');
var _ = require('lodash');

var styleLine = {
    stroke: 'blue'
};

var UEStrip = React.createClass({
    componentWillMount: function(){
        _.extend(styleLine, {
            strokeWidth: this.props.height
        });
    },
    render: function(){

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