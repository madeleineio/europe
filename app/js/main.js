/**
 * Created by nmondon on 31/10/2014.
 */

'use strict';
require('script!jquery/dist/jquery');
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
require('directives/timeline');
// services
require('services/getData');
require('services/getYearExtent');
require('services/getCursor');
require('services/getFilterCursor');
require('services/mathUtil');