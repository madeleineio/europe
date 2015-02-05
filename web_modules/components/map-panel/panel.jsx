'use strict';

require('map-panel.scss');

var React = require('react');

module.exports = React.createClass({
    render: function(){
        return (
            <div id="map-panel">
                {this.props.children}
            </div>
        );
    }
});