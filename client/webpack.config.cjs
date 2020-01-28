const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    entry: './index.tsx',
    output: {
        path: path.join(__dirname),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    // Compiles TypeScript to CommonJS
                    'ts-loader',
                ]
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    // Creates style nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
    },
    performance: {
        hints: false
    },
    devServer: {
        hot: false,
        proxy: {
            '*': {
                target: 'https://localhost:3000',
                secure: false,
            }
        },
        https: true,
        cert: '../secure/localhost.crt',
        key: '../secure/localhost.key',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new CheckerPlugin(),
        // new webpack.DefinePlugin({}),
    ]
};