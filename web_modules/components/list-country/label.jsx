'use strict';

var React = require('react');
var _ = require('lodash');

var style = {
    text1nchor: 'start',
    dominantBaseline: 'text-before-edge',
    fontFamily: 'karlaregular'
};

/**
 * @props text
 * @type {*|Function}
 */
module.exports = React.createClass({
    componentWillMount: function(){
        _.extend(style, {
            fontSize: this.props.height + 'px'
        });
    },
    render: function () {
        return (
            <text style={style} x="150">
                {this.props.text}
            </text>
        );
    }
});