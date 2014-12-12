/**
 * Created by nmondon on 12/12/2014.
 */

'use strict';

var EuroConstr = require('euroConstr');
var d3 = require('d3/d3');

module.exports = EuroConstr.factory('getStripeLineFactory', [function(){
    return function(xStart, xEnd, y, direction, size){
        return d3.range(xStart, xEnd, size).map(function(x){
            return [
                [x - size/2, y + (direction*size/2)],
                [x + size/2, y + (-1*direction*size/2)]
            ];
        });
    };
}]);

