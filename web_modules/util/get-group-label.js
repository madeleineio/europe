'use strict';

var tabLabels = [
    'CEE',
    'CEE 9',
    'CEE 10',
    'UE 12',
    'UE 15',
    'UE 25',
    'UE 27',
    'UE 28'
];

module.exports = function (ind){
    return ind < tabLabels.length ? tabLabels[ind] : ''
};