/**
 * Created by nicolasmondon on 17/01/15.
 */

var src = document.getElementById("webpack-path").getAttribute("src");
__webpack_public_path__ = src.substr(0, src.lastIndexOf("/") + 1);

// dependencies
var $ = require('jquery/dist/jquery');

// style
require('style.scss');

$(window).load(function(){
    var MapView = require('views/map');
    var TestModel = require('models/Test');
    var test = new Test({
        model: new TestModel()
    });
    test.render();
});