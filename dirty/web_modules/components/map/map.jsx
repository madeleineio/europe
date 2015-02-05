'use strict';

require('map.scss');

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');
var _ = require('lodash');

var Country = require('components/map/country');

var trans = [0, 0];

/**
 * @props countries
 * @props data
 * @type {*|Function}
 */
var Map = React.createClass({
    statics: {
        getDataByFeature: function(feature, data){
            var cid = feature.id.match(/(.+)_/)[1];
            return _.find(data, function(d){
                return d.ID === cid;
            });
        }
    },
    componentDidMount: function () {
        var svg = d3.select('.svg-map');
        var gCountry = svg.select('.g-country');
        var coordDrag;
        var dragMap = d3.behavior.drag()
            .on('dragstart', function () {
                coordDrag = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
            })
            .on('drag', function () {
                if (coordDrag) {
                    gCountry.attr('transform', 'translate(' + [
                        trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
                        trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
                    ] + ')');
                }
            })
            .on('dragend', function () {
                trans = [
                    trans[0] + d3.event.sourceEvent.pageX - coordDrag[0],
                    trans[1] + d3.event.sourceEvent.pageY - coordDrag[1]
                ];
            });
        svg.call(dragMap);
    },
    render: function () {
        var features = topojson.feature(this.props.countries, this.props.countries.objects.countries).features;
        return (
            <div id="map">
                <svg className={'svg-map'}>
                    <g className={'g-country'}>
                {features.map(function (feature, i) {
                    return <Country
                        currentYear={this.props.currentYear}
                        feature={feature}
                        data={Map.getDataByFeature(feature, this.props.data)}
                        key={i} />
                }.bind(this))}
                    </g>
                </svg>
            </div>

        );
    }
});

module.exports = Map;