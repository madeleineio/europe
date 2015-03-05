'use strict';

var React = require('react');

var Mask = React.createClass({
    render: function(){
        var style = {
            fill: this.props.backgroundColor
        };
        return (
            <rect
                style={style}
                x={0}
                y={0}
                width={this.props.widthLabels}
                height={this.props.height}
            />
        );
    }
});

module.exports = Mask;