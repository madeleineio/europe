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
var yearExtentService = require('services/get-year-extent');

// components
var MapComp = require('components/map/map');
var ListCountryContainer = require('components/list-country/container');
var Timeline = require('components/timeline/timeline');

/**
 * @props countries, jsonCountries, yearExtent
 * @type {*|Function}
 */
var Root = React.createClass({
    getInitialState: function(){
        return {
            currentYear: this.props.yearExtent[0]
        }
    },
    render: function () {
        this.props.children = React.Children.map(this.props.children, function (child) {
            return React.addons.cloneWithProps(child, {
                currentYear: this.state.currentYear
            })
        }.bind(this));
        return (
            <div className="root" style={{
                width: '100%',
                height: '100%'
            }}>
                <MapComp countries={this.props.jsonCountries} />
                <ListCountryContainer data={this.props.countries} />
                <Timeline yearExtent={this.props.yearExtent} />
            </div>
        );

    }
});


// retrieve data
P.all([
    promiseData,
    promiseGeojson
]).then(function (d) {


    var yearExtent = yearExtentService(d[0]);
    var currentYear =

        $(function () {
            React.render(
                <Root jsonCountries={d[1]}
                    countries={d[0]}
                    yearExtent={yearExtent}/>,
                $('body').get(0)
            );

        });


});