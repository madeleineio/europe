'use strict';

var React = require('react');

var styleLine = {
    stroke: 'blue',
    strokeWidth: 10
};

var UEStrip = React.createClass({
    render: function(){
        return (
            <line
                style={styleLine}
                x1={0}
                y1={5}
                x2={50}
                y2={5}
            />
        );
    }
});

module.exports = UEStrip;