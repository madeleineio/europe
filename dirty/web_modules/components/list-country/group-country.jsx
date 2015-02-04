'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className={'group-country'}>
                {this.props.children}
            </div>
        );
    }

});