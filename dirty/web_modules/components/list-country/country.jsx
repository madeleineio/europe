'use strict';

var React = require('react');
var d3 = require('d3');

var GreyLine = require('components/list-country/grey-line');
var Label = require('components/list-country/label');

/**
 * @props country
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function(){
        console.log('country');
        return (

            <svg className="country">
                <GreyLine />
                <Label text={this.props.country.nom} />
            </svg>
        );
    }
});