/**
 * Created by nicolasmondon on 18/01/15.
 */

'use strict';

var Backbone = require('backbone');

var MapModel = Backbone.Model.extend({
    defaults: function(){
        return {
            title: 'map',
            width: 0,
            height: 0
        };
    }
});

module.exports = MapModel;