/**
 * Created by nicolasmondon on 03/02/15.
 */

var $ = require('jquery');

__webpack_public_path__ = $('#webpack-loader').attr('src').slice(0, $('#webpack-loader').attr('src').lastIndexOf('/') + 1);
