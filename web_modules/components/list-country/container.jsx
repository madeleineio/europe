'use strict';

var React = require('react');
var $ = require('jquery');
var _ = require('lodash');

var Country = require('components/list-country/country');

var getGroupLabel = require('util/get-group-label');

var containerStyle = {
    position: 'relative',
    top: '100px'
};

var groupStyle = {
    margin: '10px 0',
    boxSizing: 'content-box',
    borderBottom: '1px solid black'
};

/**
 * @props data
 * @type {*|Function}
 */
module.exports = React.createClass({
    computeGroups: function () {
        var groupAdhesionUEHash = _.groupBy(this.props.data, function (c) {
            return c.UE;
        });
        var currentFirstCountryInd = 0;
        var groupAdhesionUEData = _.keys(groupAdhesionUEHash).map(function (key, i) {
            var obj = {
                key: key,
                label: getGroupLabel(i),
                countries: groupAdhesionUEHash[key],
                firstCountryInd: currentFirstCountryInd
            };
            currentFirstCountryInd += groupAdhesionUEHash[key].length;
            return obj;
        });
        return groupAdhesionUEData;
    },
    render: function () {
        var groupAdhesionUEData = this.computeGroups();
        return (
            <div id="list-country" style={containerStyle}>
                {groupAdhesionUEData.map(function (g, kg) {
                    return (
                        <div style={groupStyle} key={kg}>
                            {
                                g.countries.map(function (c, kc) {
                                    return <Country
                                        country={c}
                                        key={kc}
                                        groupLabel={g.label}
                                        ind={kc}
                                        translateStripes={this.props.translateStripes}
                                        scaleXYear={this.props.scaleXYear}
                                        yearExtent={this.props.yearExtent}
                                        widthStripes={this.props.widthStripes}
                                        backgroundColor={this.props.backgroundColor}
                                    />;
                                }.bind(this))
                            }
                        </div>
                    );
                }.bind(this))}
            </div>
        );
    }
});