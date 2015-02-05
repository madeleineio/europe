/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

var React = require('react');
var tweenState = require('react-tween-state');
var d3 = require('d3');

var simplify = require('services/get-simplify');
var projection = require('services/get-projection');
var path = d3.geo.path()
    .projection(simplify(.05, projection));

var ueInterpolation = d3.interpolateRgb('#fff', 'rgb(0,158,255)');

/**
 * @props feature
 * @type {*|Function}
 */
var Country = React.createClass({
    mixins: [tweenState.Mixin],
    getInitialState: function(){
        return {
            ue: 0,
            rendering: !!this.props.data
        }
    },
    componentWillReceiveProps: function(nextProps){
        if(nextProps.data){
            if(nextProps.data.UE <=  this.props.currentYear){
                this.tweenState('ue',{
                    easing: tweenState.easingTypes.easeInOutQuad,
                    duration: 500,
                    endValue: 1
                });
            }else {
                this.tweenState('ue',{
                    easing: tweenState.easingTypes.easeInOutQuad,
                    duration: 500,
                    endValue: 0
                });
            }
        }

    },
    shouldComponentUpdate: function(nextProps, nextState){
        return this.state.rendering;
    },
    handleMouseOver: function(){

    },
    getRGB: function(){
        return ueInterpolation(this.getTweeningValue('ue'));
    },
    render: function(){
        return (
            <path className={'country'}
                d={path(this.props.feature)}
                fill={this.getRGB()}
                stroke={this.getRGB()}
                onMouseOver={this.handleMouseOver}></path>
        );
    }
});

module.exports = Country;