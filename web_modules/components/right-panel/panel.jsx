'use strict';

require('right-panel.scss');

var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({
    getInitialState: function(){
        return this.computeState();
    },
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
    componentWillReceiveProps: function(){
        this.setState(this.computeState());
    },
    computeState: function(){
        return {
            widthLabels: 0.4 * $(window).width() / 2,
            widthStripes: 0.6 * $(window).width() / 2,
            translateStripes: {
                transform: 'translate(' + [(0.4 * $(window).width() / 2) + 'px', 0] + ')'
            }
        };
    },
    renderChildren: function () {
        return React.Children.map(this.props.children, function (child) {
            return React.addons.cloneWithProps(child, {
                yearExtent: this.props.yearExtent,
                currentYear:this.props.currentYear,
                widthLabels: this.state.widthLabels,
                widthStripes: this.state.widthStripes,
                translateStripes: this.state.translateStripes
            });
            return child;
        }.bind(this));
    },

    render: function () {
        return (
            <div id="right-panel">
                {this.renderChildren()}
            </div>
        );
    }
});