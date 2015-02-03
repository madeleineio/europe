var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './web_modules/main.js',
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    externals: {
        'jquery': 'jQuery',
        'lodash': '_',
        'd3': 'd3',
        'topojson': 'topojson',
        'bluebird': 'P'
    },
    resolve: {
        root: [
            path.resolve('node_modules'),
            path.resolve('web_modules'),
            path.resolve('sass')
        ],
        extensions: ['', '.js', 'ejs']
    },
    module: {
        loaders: [
            // css and style loader
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
            { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" }
        ]
    },
    devtool: 'source-map'
};