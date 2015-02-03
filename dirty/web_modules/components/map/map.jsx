'use strict';

require('map.scss');

var React = require('react');
var d3 = require('d3');
var topojson = require('topojson');

var CountriesContainer = require('components/map/countries-container');

var coordDrag;

/**
 * @props countries
 * @type {*|Function}
 */
module.exports = React.createClass({
    getInitialState: function () {
        return {
            gTranslate: 'translate(0,0)',
            x: 0,
            y: 0,
            forceCountriesRendering: true
        };
    },
    handleDragStart: function (e) {
        console.log('on drag start')
        coordDrag = [e.clientX, e.clientY];
    },
    handleDrag: function (e) {
        console.log('on drag')
        e.stopPropagation();
        e.preventDefault();
        var trans = [
            this.state.x + e.clientX - coordDrag[0],
            this.state.y + e.clientY - coordDrag[1]
        ];
        this.setState({
            gTranslate: 'translate(' + trans + ')',
            forceCountriesRendering: false
        });

    },
    handleDragEnd: function (e) {
        console.log('on drag end')
    },
    render: function () {
        var features = topojson.feature(this.props.countries, this.props.countries.objects.countries).features;
        return (
            <div className={'svg-container'}
                draggable="true"
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragEnd={this.handleDragEnd}
            >
                <svg className={'svg-map'}>
                    <g className={'g-translatable'} transform={this.state.gTranslate}>
                        <CountriesContainer
                            rendering={this.state.forceCountriesRendering}
                            features={features}/>
                    </g>
                </svg>
            </div>
        );
    }
});