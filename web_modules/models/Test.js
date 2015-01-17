/**
 * Created by nicolasmondon on 17/01/15.
 */

'use strict';

var Backbone = require('backbone');

var TestModel = Backbone.Model.extend({
    defaults: function(){
        return {
            toto: 'tata'
        };
    }
});

module.exports = TestModel;