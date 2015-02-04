/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

// webpack path
require('util/webpack-path');
// style
require('reset.scss');



// vendors
var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var P = require('bluebird');
var React = require('react');

// services
var promiseGeojson = require('services/get-json-map');
var promiseData = require('services/get-csv-data');

// components
//var map = require('components/map');
var MapComp = require('components/map/map');
var controlPanel = require('components/control-panel');

// retrieve data
P.all([
    promiseData,
    promiseGeojson
]).then(function (d) {
    //map.init(d[1]);
    //map.render();

    React.render(
        <MapComp countries={d[1]} />,
        $('#map').get(0)
    );

    controlPanel.init(d[0]);
    controlPanel.render();
});