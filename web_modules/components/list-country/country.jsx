'use strict';

var React = require('react');
var d3 = require('d3');

var Label = require('components/list-country/label');
var GroupLabel = require('components/list-country/group-label');
var UEStrip = require('components/list-country/ue');

/**
 * @props country
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {
        console.log(this.props.translateStripes);
        return (
            <svg className="country">
                <GroupLabel ind={this.props.ind} label={this.props.groupLabel}/>
                <Label text={this.props.country.nom} />
                <g style={this.props.translateStripes}>
                    <UEStrip
                        begin={this.props.country.UE}
                        currentYear={this.props.currentYear}
                        yearExtent={this.props.yearExtent}
                    />
                </g>
            </svg>
        );
    }
});