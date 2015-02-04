'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className={'g-list-country'}>
                {this.props.children}
            </div>
        );
    }

});