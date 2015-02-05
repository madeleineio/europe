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


/**
 * @props feature
 * @type {*|Function}
 */
var Country = React.createClass({
    mixins: [tweenState.Mixin],
    statics: {
        getFill: function(data, currentYear){
            if(data === undefined){
                return 255
            }
            return 0;
        }
    },
    getInitialState: function(){
        return {
            b: 0,
            rendering: Country.getFill(this.props.data, this.props.currentYear) === 0
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.tweenState('b',{
            easing: tweenState.easingTypes.easeInOutQuad,
            duration: 1000,
            endValue: 255
        });
    },
    shouldComponentUpdate: function(nextProps, nextState){
        return this.state.rendering;
    },
    handleMouseOver: function(){

    },
    getRGB: function(){
        console.log('rgb(' + [255, 255, this.getTweeningValue('b')] + ')');
        return 'rgb(' + [255, 255, parseInt(this.getTweeningValue('b'))] + ')';

    },
    render: function(){
        return (
            <path className={'country'}
                d={path(this.props.feature)}
                fill={this.getRGB()}
                onMouseOver={this.handleMouseOver}></path>
        );
    }
});

module.exports = Country;