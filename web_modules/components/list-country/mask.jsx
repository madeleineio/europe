'use strict';

var React = require('react');

var style = {
    stroke: 'none',
    fill: '#ffffff'
};

var Mask = React.createClass({
    render: function () {
        return (
            <mask id={this.props.id}
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height} >
                <rect
                    x={this.props.x}
                    y={this.props.y}
                    width={this.props.width}
                    height={this.props.height}
                    style={style}
                />
            </mask>
        );
    }
});

module.exports = Mask;