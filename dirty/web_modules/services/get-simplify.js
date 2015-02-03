/**
 * Created by nicolasmondon on 03/02/15.
 */

'use strict';

var d3 = require('d3');

module.exports = function (area, projection) {
    return d3.geo.transform({
        point: function (x, y, z) {
            if (z >= area) {
                var coords = projection([x, y]);
                this.stream.point(coords[0], coords[1]);
            }
        }
    });
};