'use strict';

var React = require('react');

/**
 * @props text
 * @type {*|Function}
 */
module.exports = React.createClass({
    render: function () {

        var style = {
            text1nchor: 'start',
            dominantBaseline: 'text-before-edge',
            fontSize: this.props.height + 'px',
            fontFamily: 'karlaregular'
        };

        return (
            <text style={style} x="150">
                {this.props.text}
            </text>
        );
    }
});