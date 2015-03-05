'use strict';

var React = require('react');
var $ = require('jquery');
var d3 = require('d3');

var getYearRange = require('util/get-year-range');

var backgroundColor = 'rgb(232, 230, 215)';

var style = {
    overflow: 'scroll',
    position: 'fixed',
    backgroundColor: backgroundColor,
    width: '50%',
    height: '100%',
    zIndex: 2,
    top: '0%',
    left: '50%'
};

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
        var widthStripes = 0.6 * $(window).width() / 2;
        var yearRange = getYearRange(this.props.currentYear, this.props.yearExtent);
        return {
            widthLabels: 0.4 * $(window).width() / 2,
            widthStripes: widthStripes,
            translateStripes: {
                transform: 'translate(' + [(0.4 * $(window).width() / 2) + 'px', 0] + ')'
            },
            scaleXYear: d3.scale.linear()
                .domain(yearRange)
                .rangeRound([0, widthStripes])
        };
    },
    renderChildren: function () {
        return React.Children.map(this.props.children, function (child) {
            return React.addons.cloneWithProps(child, {
                yearExtent: this.props.yearExtent,
                currentYear:this.props.currentYear,
                widthLabels: this.state.widthLabels,
                widthStripes: this.state.widthStripes,
                translateStripes: this.state.translateStripes,
                scaleXYear: this.state.scaleXYear,
                backgroundColor: backgroundColor
            });
            return child;
        }.bind(this));
    },

    render: function () {
        return (
            <div id="right-panel" style={style}>
                {this.renderChildren()}
            </div>
        );
    }
});