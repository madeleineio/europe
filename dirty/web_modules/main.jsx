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
var yearExtent = require('services/get-year-extent');

// components
var MapComp = require('components/map/map');
var ListCountryContainer = require('components/list-country/container');
var Timeline = require('components/timeline/timeline');


// retrieve data
P.all([
    promiseData,
    promiseGeojson
]).then(function (d) {

    $(function () {
        React.render(
            <MapComp countries={d[1]} />,
            $('#map').get(0)
        );

        React.render(
            <ListCountryContainer data={d[0]}/>,
            $('#list-country').get(0)
        );

        React.render(
            <Timeline yearExtent={yearExtent(d[0])} />,
            $('#timeline').get(0)
        );

    });


});