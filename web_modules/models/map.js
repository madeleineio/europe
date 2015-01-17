/**
 * Created by nicolasmondon on 18/01/15.
 */

'use strict';

var Backbone = require('backbone');

var MapModel = Backbone.Model.extend({
    defaults: function(){
        return {
            title: 'map'
        };
    }
});

module.exports = MapModel;