/**
 * Created by nicolasmondon on 04/12/2014.
 */

/**
 * Created by nicolasmondon on 04/12/2014.
 */

'use strict';

var d3 = require('d3/d3');
var EuroConstr = require('euroConstr');

module.exports = EuroConstr.factory('getCursorFilterFactory', [function(){

    return function(d3Defs, id){
        var filter, feMerge;

        filter = d3Defs.append('filter')
            .attr('id', id)
            .attr('y', -10)
            .attr('height', 40)
            .attr('x', -10)
            .attr('width', 150);

        filter.append('feOffset')
            .attr('in', 'SourceAlpha')
            .attr('dx', 3)
            .attr('dy', 3)
            .attr('result', 'offset2');

        filter.append('feGaussianBlur')
            .attr('in', 'offset2')
            .attr('stdDeviation', 3)
            .attr('result', 'blur2');

        feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'blur2');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    };

}]);
