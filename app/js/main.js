/**
 * Created by nmondon on 31/10/2014.
 */


var src = document.getElementById("webpack-path").getAttribute("src");
__webpack_public_path__ = src.substr(0, src.lastIndexOf("/") + 1);

console.log(__webpack_public_path__);

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
require('services/getLosange');
require('services/getStripeLine');
require('services/getFilterCursor');
require('services/mathUtil');