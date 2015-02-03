/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

// style
require('list-country.scss');

var d3 = require('d3');
var $ = require('jquery');

var svg;
var root;
var data;
var w, h;
function init(data, svg, w, h){
    svg = svg;
    data = data;
    w = w;
    h = h;
    root = svg.append('g')
        .attr('class', 'g-timeline');
};

function render(){

};

module.exports ={
    init: init,
    render: render
};