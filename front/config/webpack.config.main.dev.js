const webpack = require('webpack');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, '../app', 'dist', 'main');

module.exports = {
    mode: 'development',
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        main: './src/main/index.js',
    },
    output: {
        path: OUTPUT_PATH,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules|bower_components|public)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            // options的内容是传入babel的配置的
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            // @@babel/plugin-proposal-class-properties 用于解决class中直接初始化属性语法问题
                            // https://github.com/babel/babel/issues/8655
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        },
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ],
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            $dirname: '__dirname',
        }),
    ],
};