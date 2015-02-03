/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

var d3 = require('d3');

module.exports =  d3.geo.stereographic()
    .scale(1600)
    .center([35, 50]);