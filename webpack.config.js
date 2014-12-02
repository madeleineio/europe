/**
 * @see https://github.com/stackfull/angular-seed/blob/master/webpack.config.js
 */

'use strict';

var path = require('path');

module.exports = {
    entry: {
        main: './app/js/main.js'
    },
    output: {
        path: 'public/js',
        filename: '[name].min.js'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.css'],
        root: [
            // We want roots to resolve the app code:
            path.resolve('app', 'js'),
            // node modules
            path.resolve('node_modules'),
            // css dir
            path.resolve('app', 'css')
        ]
    },
    module: {
        loaders: [
            // css and style loader
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    }
};