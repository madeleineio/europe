module.exports = {
    entry: {
        main: './js/entry.js'
    },
    output: {
        path: 'public/js',
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};