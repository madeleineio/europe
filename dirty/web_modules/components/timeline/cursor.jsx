'use strict';

var React = require('react');
var d3 = require('d3');

var trans = [0, 0];

/**
 * @props getCenter
 * @props size
 * @props constrain
 * @type {*|Function}
 */
module.exports = React.createClass({
    getInitialState: function(){
        return {
            transform: 'translate(0,0)'
        };
    },
    getCoords: function(){
        var coords;
        var center = this.props.center;
        var size = this.props.size;

        coords = [
            [ center[0] - size, center[1] - size ],
            [ center[0] - size, center[1] + size ],
            [ center[0] + size, center[1] + size ],
            [ center[0] + size, center[1] - size ],
            [ center[0], center[1] - 2*size ]
        ];

        return coords.map(function(pt){
            return pt.join(',');
        }).join(' ');
    },
    componentDidMount: function(){
        var svg = d3.select('.svg-timeline');
        var el = svg.select('.cursor');
        var coordDrag;
        var dragMap = d3.behavior.drag()
            .on('dragstart', function () {
                coordDrag = [d3.event.sourceEvent.pageX, 0];
            })
            .on('drag', function () {
                if (coordDrag) {
                    this.setState({
                        'transform': 'translate(' + [trans[0] + d3.event.sourceEvent.pageX - coordDrag[0], 0] + ')'
                    });
                }
            }.bind(this))
            .on('dragend', function () {
                trans = [trans[0] + d3.event.sourceEvent.pageX - coordDrag[0], 0];
            });
        el.call(dragMap);
    },
    render: function(){
        return (
            <polygon className="cursor" points={this.getCoords()} transform={this.state.transform}/>
        );
    }
});