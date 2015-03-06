'use strict';

require('map.scss');

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');
var _ = require('lodash');

var Country = require('components/map/country');
var OTANStroke = require('components/map/otan');

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
    computeOTANGroups: function(topology, objects){
        return topojson.merge(topology, objects.filter(function(o){
            var cid = o.id.match(/(.+)_/)[1];
            var test = ['250', '380', '620', '276'].indexOf(cid) >= 0;
            return test;
        }));
    },
    render: function () {
        var features = topojson.feature(this.props.simpleCountries, this.props.simpleCountries.objects.countries).features;
        var otanGroup = this.computeOTANGroups(this.props.countries, this.props.countries.objects.countries.geometries);
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
                        <OTANStroke
                            feature={otanGroup}
                        />
                    </g>

                </svg>
            </div>

        );
    }
});

module.exports = Map;