/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

// style
require('list-country.scss');


var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');

var svg;
var root;
var data;
var w, h;
function init(dataPar, rootPar, wPar, hPar) {
    root = rootPar;
    data = dataPar;
    w = wPar;
    h = hPar;
};

function render() {

    var groupAdhesionUEHash = _.groupBy(data, function (c) {
        return c.UE;
    });

    var currentFirstCountryInd = 0;
    var groupAdhesionUEData = _.keys(groupAdhesionUEHash).map(function (key, i) {
        var obj = {
            key: key,
            countries: groupAdhesionUEHash[key],
            firstCountryInd: currentFirstCountryInd
        };
        currentFirstCountryInd += groupAdhesionUEHash[key].length;
        return obj;
    });

    var marginHeightGroup = 10;
    var scaleMarginHeightGroup = d3.scale.linear()
        .domain([0, data.length-1])
        .rangeRound([0, h - (groupAdhesionUEData.length - 1) * marginHeightGroup]);

    var gGroupAdhesionUE = root.selectAll('.g-group-adhesion-ue').data(groupAdhesionUEData);
    gGroupAdhesionUE.enter().append('g')
        .attr('class', 'g-group-adhesion-ue')
        .attr('transform', function (g, i) {
            return 'translate(' + [
                    0,
                    scaleMarginHeightGroup(g.firstCountryInd) + marginHeightGroup*i
                ] + ')';
        });

    var countryLabels = gGroupAdhesionUE.selectAll('.country-label').data(function (d) {
        return d.countries;
    });
    countryLabels.enter().append('text')
        .attr('class', 'country-label')
        .attr('x', 10)
        .attr('y', function (c, i) {
            return scaleMarginHeightGroup(i);
        })
        .text(function (c) {
            return c.nom;
        })


};

module.exports = {
    init: init,
    render: render
};