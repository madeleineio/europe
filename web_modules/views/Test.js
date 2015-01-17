/**
 * Created by nicolasmondon on 17/01/15.
 */

'use strict';

var $ = require('jquery/dist/jquery');
var _ = require('underscore/underscore');
var Backbone = require('backbone');
var template = require('templates/test');

module.exports = Backbone.View.extend({
    el: $('.map').get(0),
    template: template,
    initialize: function(){
        alert('toto');
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    }
});