/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

// style
require('control-panel.scss');

var d3 = require('d3');
var $ = require('jquery');

var $el;

function init(){
    $el = $('#control-panel');
    $el.hammer().on('swiperight', function(){
        $el.velocity({
            left: '90%'
        }, {
            duration: 200
        });
    }).on('swipeleft', function(){
        $el.velocity({
            left: '55%'
        }, {
            duration: 200,
            easing: 'easeOutQuart'
        });
    });

};

function render(){

};

module.exports = {
    init: init,
    render: render
};