/**
 * Created by nicolasmondon on 02/02/15.
 */

'use strict';

module.exports = {

    /**
     * Constrains a value to not exceed a maximum and minimum value.
     *
     * @param {int|float} value   the value to constrain
     * @param {int|float} value   minimum limit
     * @param {int|float} value   maximum limit
     *
     * @returns {int|float}
     *
     * @see max
     * @see min
     */
    constrain: function (aNumber, aMin, aMax) {
        return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
    }
};