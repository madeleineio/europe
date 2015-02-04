/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

var P = require('bluebird');
var d3 = require('d3');
var _ = require('lodash');

function toNum(str){
    return !!str ? parseInt(str) : null
};

var promise = new P(function(resolve){
    d3.csv('data/UEvsOTAN.csv', function(data){
        // transform
        data = data.filter(function(el){
            return toNum(el.UE) !== null;
        }).map(function(el){
            return _.extend({}, el, {
                OTAN: toNum(el.OTAN),
                PPP: toNum(el.PPP),
                UE: toNum(el.UE),
                'candidature non officielle': toNum(el['candidature non officielle']),
                'candidature officielle': toNum(el['candidature officielle'])
            });
        });

        resolve(data);

        /*resolve(_.groupBy(data, function(c){
            return c.UE;
        }));*/
    });
});

module.exports = promise;