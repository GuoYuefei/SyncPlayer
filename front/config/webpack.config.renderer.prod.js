const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config.renderer.common.prod');

module.exports = merge(common, {
    target: 'electron-renderer',

    plugins: [
        new webpack.DefinePlugin({
            IS_WEB: false,
        })
    ]
});