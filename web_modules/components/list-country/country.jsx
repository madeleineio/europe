'use strict';

var React = require('react');
var d3 = require('d3');

var Label = require('components/list-country/label');
var GroupLabel = require('components/list-country/group-label');
var UEStrip = require('components/list-country/ue');
var OTANStrip = require('components/list-country/otan');
var Mask = require('components/list-country/mask');

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
        var maskId = 'mask' + this.props.ind;
        return (
            <svg style={style}>
                <defs>
                    <Mask
                        id={maskId}
                        x={0}
                        width={this.props.widthStripes}
                        y={0}
                        height={heightLine}
                    />
                </defs>
                <g style={this.props.translateStripes}>
                    <OTANStrip
                        scaleXYear={this.props.scaleXYear}
                        begin={this.props.country.OTAN}
                        yearExtent={this.props.yearExtent}
                        height={heightLine}
                        mask={maskId}
                    />
                    <UEStrip
                        scaleXYear={this.props.scaleXYear}
                        begin={this.props.country.UE}
                        yearExtent={this.props.yearExtent}
                        height={heightLine}
                        mask={maskId}
                    />
                </g>
                <GroupLabel ind={this.props.ind} label={this.props.groupLabel}/>
                <Label
                    text={this.props.country.nom}
                    height={heightLine}
                />
            </svg>
        );
    }
});