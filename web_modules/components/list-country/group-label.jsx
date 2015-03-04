'use strict';

var React = require('react');

var style = {
    textAnchor: 'start',
    dominantBaseline: 'text-before-edge',
    fontSize: '14px',
    fontFamily: 'karlaregular',
    fontWeight: 'bolder'
};

var GroupLabel = React.createClass({
    render: function () {
        return (
            <text x={10} style={style}>
                {this.props.ind === 0 ? this.props.label : ''}
            </text>
        );
    }
});

module.exports = GroupLabel;