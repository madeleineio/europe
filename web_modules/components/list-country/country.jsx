'use strict';

var React = require('react');
var d3 = require('d3');

var Label = require('components/list-country/label');
var GroupLabel = require('components/list-country/group-label');
var UEStrip = require('components/list-country/ue');

var heightLine = 12;

var style = {
    height: (heightLine + 4) + 'px',
    width: '100%'
};

/**
 * @props country
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {
        return (
            <svg style={style}>
                <GroupLabel ind={this.props.ind} label={this.props.groupLabel}/>
                <Label
                    text={this.props.country.nom}
                    height={heightLine}
                />
                <g style={this.props.translateStripes}>
                    <UEStrip
                        begin={this.props.country.UE}
                        currentYear={this.props.currentYear}
                        yearExtent={this.props.yearExtent}
                        height={heightLine}
                    />
                </g>
            </svg>
        );
    }
});