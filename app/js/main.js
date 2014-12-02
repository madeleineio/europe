/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';
require('jquery/dist/jquery');
// angular proper modules
require('script!angular/angular');
require('script!angular-route/angular-route');
// create app
require('euroConstr');
// configure app routes
require('configs/index');
// controllers
require('controllers/InitCtrl');
require('controllers/HomeCtrl');
// directives
require('directives/map');