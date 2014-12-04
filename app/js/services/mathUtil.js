/**
 * Created by nicolasmondon on 04/12/2014.
 */


var EuroConstr = require('euroConstr');

module.exports = EuroConstr.factory('mathUtilFactory', [function(){
    return {
        constrain: function(aNumber, aMin, aMax) {
            return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
        }
    }
}]);