'use strict';

var React = require('react');

/**
 * @props text
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {
        return (
            <text className={'country-label'}>
                {this.props.text}
            </text>
        );
    }
});