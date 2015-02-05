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
    setCurrentYear: function(year){
        this.setState({
            currentYear: year
        });
    }.bind(this),
    shouldComponentUpdate: function(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    render: function () {
        return (
            <div className="root" style={{
                width: '100%',
                height: '100%'
            }}>
                <MapComp countries={this.props.jsonCountries} currentYear={this.state.currentYear} />
                <ListCountryContainer data={this.props.countries} currentYear={this.state.currentYear} />
                <Timeline yearExtent={this.props.yearExtent}
                    currentYear={this.state.currentYear}
                    setCurrentYear={this.setCurrentYear}
                />
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