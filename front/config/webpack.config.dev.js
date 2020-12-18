const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// https://github.com/webpack/webpack/issues/6568, 需要使用4.x.x版本的，暂且只有beta版
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// https://www.cnblogs.com/jack-zhou21235/p/12010088.html

const OUTPUT_PATH = path.resolve(__dirname, '../dist');

module.exports = {
    mode: 'development',
    // entry: './index.jsx',
    // output: {
    //     filename: 'index.js',
    //     path: path.resolve(__dirname, 'dist')
    // },

    // 多入口模式配置
    entry: {
        index: './index.jsx',
    },

    output: {
        filename: '[name].js',
        path: OUTPUT_PATH
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css']
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
            {
                test: /\.css$/,
                // exclude: /(node_modules|bower_components)/,        // 这个需要保留对node_modules的影响
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        }
                    }
                }]
            }
        ],
    },

    // 构建代码映射源码，用于查错
    devtool: 'inline-source-map',
    devServer: {
        contentBase: OUTPUT_PATH,
        // compress: true,
        port: 4321,
        clientLogLevel: 'none'
    },
    plugins: [
        // 拷贝单文件或目录到构建目录
        new CopyWebpackPlugin([
            { from: 'public/', to: './' }
        ]),

        new CleanWebpackPlugin(),

        new webpack.DefinePlugin({
            MOUNT_NODE_ID: JSON.stringify('root'),
        })
    ]
};
