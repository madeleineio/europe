'use strict';

var React = require('react');
var projection = require('services/get-projection');

var style = {
    fill: 'red'
}

var OTANStroke = React.createClass({
    render: function () {
        return (
            <g>
            {
                this.props.data.map(function (d, k) {
                    return <circle
                        key={k}
                        style={style}
                        cx={projection(d)[0]}
                        cy={projection(d)[1]}
                        r={1}
                    />;
                })
            }
            </g>
        )
    }
});

module.exports = OTANStroke;