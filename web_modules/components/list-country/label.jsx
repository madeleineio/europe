'use strict';

var React = require('react');

/**
 * @props text
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {
        return (
            <text className={'country-label'} x="150">
                {this.props.text}
            </text>
        );
    }
});