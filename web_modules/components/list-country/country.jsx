'use strict';

var React = require('react');
var d3 = require('d3');

var Label = require('components/list-country/label');
var GroupLabel = require('components/list-country/group-label');

/**
 * @props country
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function(){
        return (
            <svg className="country">
                <GroupLabel ind={this.props.ind} label={this.props.groupLabel}/>
                <Label text={this.props.country.nom} />
            </svg>
        );
    }
});