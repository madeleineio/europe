/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

var P = require('bluebird');
var d3 = require('d3');

var promise = new P(function(resolve){
    d3.csv('data/UEvsOTAN.csv', resolve);
});

module.exports = promise;