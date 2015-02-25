'use strict';

var React = require('react');
var d3 = require('d3');

var styleCursorDrag = {
    'fill': 'rgba(0,0,0,0)'
};

var trans = [0, 0];

/**
 * @props getCenter
 * @props size
 * @props constrain
 * @type {*|Function}
 */
module.exports = React.createClass({
    getInitialState: function () {
        trans = [this.scaleYear()(this.props.currentYear), 0];
        return {
            transform: 'translate(' + trans + ' )'
        };
    },
    scaleYear: function () {
        return d3.scale.linear()
            .domain(this.props.yearExtent)
            .range(this.props.constrain)
            .clamp(true);
    },
    getCoords: function (ind) {
        var coords;
        var center = [this.scaleYear()(this.props.currentYear) - this.scaleYear()(this.props.yearExtent[0]), this.props.y];
        var size = this.props.size;

        coords = [
            [center[0] - size, center[1]],
            [center[0] + size, center[1]],
            [center[0], center[1] + (ind*size)]
        ];

        return coords.map(function (pt) {
            return pt.join(',');
        }).join(' ');
    },
    componentDidMount: function () {
        var svg = d3.select('.svg-timeline');
        var el = svg.select('.cursor-drag');
        var coordDrag;
        var dragMap = d3.behavior.drag()
            .on('dragstart', function () {
                coordDrag = [d3.event.sourceEvent.pageX, 0];
            })
            .on('drag', function () {
                if (coordDrag) {
                    this.props.setCurrentYear(
                        d3.round(this.scaleYear().invert(trans[0] + d3.event.sourceEvent.pageX - coordDrag[0]))
                    );
                }
            }.bind(this))
            .on('dragend', function () {
                trans = [trans[0] + d3.event.sourceEvent.pageX - coordDrag[0], 0];
            });
        el.call(dragMap);
    },
    render: function () {
        return (
            <g>
                <polygon className="cursor" points={this.getCoords(1)} transform={this.state.transform}/>
                <polygon className="cursor" points={this.getCoords(-1)} transform={this.state.transform}/>
                <rect
                    className="cursor-drag"
                    style={styleCursorDrag}
                    x={0}
                    y={0}
                    width={1000}
                    height={1000}
                />
            </g>
        );
    }
});