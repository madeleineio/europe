/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

// style
require('control-panel.scss');

var d3 = require('d3');
var $ = require('jquery');

// sub modules
var listCountry = require('components/list-country');

var $el;
var svgTimeline;
var $svgTimeline;
var gListCountry;

function init(csvData) {
    $el = $('#control-panel');
    // TODO opacity on hover
    $el.hammer().on('swiperight', function () {
        $el.velocity({
            left: '90%'
        }, {
            duration: 200
        });
    }).on('swipeleft', function () {
        $el.velocity({
            left: '55%'
        }, {
            duration: 200,
            easing: 'easeOutQuart'
        });
    });

    svgTimeline = d3.select('#control-panel').append('svg')
        .attr('class', 'svg-timeline');
    $svgTimeline = $('.svg-timeline');

    //
    listCountry.init(csvData,
        svgTimeline.append('g')
            .attr('class', 'g-list-country')
        .attr('transform', 'translate(' + [0, $svgTimeline.height()/4] + ')'),
        $svgTimeline.width() / 4,
        $svgTimeline.height()*3/4);
};

function render() {
    listCountry.render();
};

module.exports = {
    init: init,
    render: render
};