/**
 * Created by nicolasmondon on 04/12/2014.
 */

'use strict';

var EuroConstr = require('euroConstr');

module.exports = EuroConstr.factory('getCursorFactory', [function(){
    return function(center, size){
        var coords;

        coords = [
            [ center[0] - size, center[1] - size ],
            [ center[0] - size, center[1] + size ],
            [ center[0] + size, center[1] + size ],
            [ center[0] + size, center[1] - size ],
            [ center[0], center[1] - 2*size ]
        ];

        return coords.map(function(pt){
            return pt.join(',');
        }).join(' ');
    };
}]);
