const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const packageName = require('./../package.json').name;
const APP_ENV = process.env.APP_ENV;

require("custom-env").env(APP_ENV);

module.exports = {
    entry: path.resolve("src/index.tsx"),
    output: {
        filename: "[name].[hash].js",
        path: path.resolve("dist"),
        publicPath: "/",
        library: `${packageName}-[name]`,
        libraryTarget: 'umd',
        chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {loader: "babel-loader"}
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: ["file-loader"]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    resolve: {
        alias: {
            "@": path.resolve("src"),
        },
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: `style/[name].[chunkhash].css` }),
        new OptimizeCss(),
        new HtmlWebpackPlugin({
            template: path.resolve("src/index.html"),
            filename: "index.html",
            inject: "body"
        }),
        new DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "public", to: "public" }
            ],
        })
    ]
}