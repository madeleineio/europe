'use strict';

require('right-panel.scss');

var React = require('react');

module.exports = React.createClass({
    componentDidMount: function () {
        var $el = $('#right-panel');
        // TODO opacity on hover
        $el.hammer().on('swiperight', function () {
            $el.velocity({
                left: '90%'
            }, {
                duration: 200
            });
        }).on('swipeleft', function () {
            $el.velocity({
                left: '50%'
            }, {
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    },
    render: function () {
        return (
            <div id="right-panel">
                {this.props.children}
            </div>
        );
    }
});