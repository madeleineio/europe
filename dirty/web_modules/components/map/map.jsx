'use strict';

require('map.scss');

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');


var Country = require('components/map/country');

/**
 * @props countries
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {
        var features = topojson.feature(this.props.countries, this.props.countries.objects.countries).features;
        return (
            <svg className={'svg-map'}>
                <g className={'g-country'}>
                    {features.map(function (feature) {
                        return <Country feature={feature}/>
                    })}
                </g>
            </svg>
        );
    }
});