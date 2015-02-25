'use strict';

var math = require('util/math');

module.exports = function (currentYear, yearExtent) {
    var firstYearVisible = math.constrain(currentYear - 7.5, yearExtent[0], yearExtent[1]);
    var lastYearVisible = math.constrain(firstYearVisible + 15, yearExtent[0], yearExtent[1]);
    firstYearVisible = lastYearVisible - 15;
    return [
        firstYearVisible, lastYearVisible
    ];
};