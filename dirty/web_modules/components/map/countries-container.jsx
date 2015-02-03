/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

var React = require('react');
var Country = require('components/map/country');

/**
 * @props features
 * @props rendering
 * @type {*|Function}
 */
module.exports = React.createClass({
    shouldComponentUpdate: function (nextProps, nextState) {
        return nextProps.rendering;
    },
    render: function () {
        return (
            <g className={'g-country'}>
                {this.props.features.map(function (feature, i) {
                    return <Country
                        feature={feature}
                        key={i} />
                })}
            </g>
        );
    }
});