'use strict';

var React = require('react');

var style = {
    'text-anchor': 'start',
    'dominant-baseline': 'text-before-edge',
    'font-size': '14px',
    'font-family': 'karlaregular',
    'font-weight': 'bolder'
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