'use strict'
const { resolve } = require('path')
module.exports = {
    entry: './client/index.js',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                include: [resolve(__dirname,'client')],
                loader: 'babel-loader',
                options: {
                    presets:['react','es2015']
                }

            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}