/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';
var P = require('bluebird');
var d3 = require('d3');

var promise = new P(function(resolve){
    d3.json('data/topo/world-50m.json', resolve);
});

module.exports = promise;