/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

var React = require('react');
var d3 = require('d3');

var simplify = require('services/get-simplify');
var projection = require('services/get-projection');
var path = d3.geo.path()
    .projection(simplify(.05, projection));

/**
 * @props feature
 * @type {*|Function}
 */
module.exports = React.createClass({

    render: function(){
        return (
            <path className={'country'} d={path(this.props.feature)}></path>
        );
    }
});