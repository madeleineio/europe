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
var MapPanel = require('components/map-panel/panel');
var Map = require('components/map/map');
var Timeline = require('components/timeline/timeline');

var RightPanel = require('components/right-panel/panel');
var SmallTimeline = require('components/small-timeline/timeline');
var ListCountryContainer = require('components/list-country/container');


/**
 * @props countries, jsonCountries, yearExtent
 * @type {*|Function}
 */
var Root = React.createClass({
    getInitialState: function () {
        return {
            currentYear: this.props.yearExtent[0]
        }
    },
    setCurrentYear: function (year) {
        this.setState({
            currentYear: year
        });
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    render: function () {
        return (
            <div className="root" style={{
                width: '100%',
                height: '100%'
            }}>
                <MapPanel>
                    <Map countries={this.props.jsonCountries}
                        data={this.props.countries}
                        currentYear={this.state.currentYear} />
                    <Timeline yearExtent={this.props.yearExtent}
                        currentYear={this.state.currentYear}
                        setCurrentYear={this.setCurrentYear}/>
                </MapPanel>

                <RightPanel>
                    <SmallTimeline yearExtent={this.props.yearExtent}
                        currentYear={this.state.currentYear}/>
                    <ListCountryContainer data={this.props.countries}
                        currentYear={this.state.currentYear} />
                </RightPanel>
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