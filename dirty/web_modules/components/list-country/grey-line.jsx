'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function(){
        return (
            <line className="grey-line" x1={10} x2={2000} y1={7.5} y2={7.5}/>
        );
    }
});