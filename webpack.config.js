/**
 * @see https://github.com/stackfull/angular-seed/blob/master/webpack.config.js
 */

'use strict';

var path = require('path');

module.exports = {
    entry: {
        main: './web_modules/main.js'
    },
    output: {
        path: 'public/js',
        filename: '[name].min.js',
        sourceMapFilename: '[file].map'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.css', '.ejs'],
        root: [
            // We want roots to resolve the app code:
            path.resolve('web_modules'),
            // node modules
            path.resolve('node_modules'),
            // sass dir
            path.resolve('sass')
        ]
    },
    module: {
        loaders: [
            // css and style loader
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
            { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" },
            // ejs templates
            {test: /\.ejs$/,    loader: "ejs-compiled-loader"}
        ]
    },
    devtool: 'eval'
};