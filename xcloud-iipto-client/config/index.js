'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
module.exports = {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: 'vue-style-loader', // creates style nodes from JS strings
        },
        {
          loader: 'css-loader', // translates CSS into CommonJS
        },
        {
          loader: 'less-loader', // compiles Less to CSS
        },
      ],
    },
  ],
  dev: {
    proxyTable: {
      '/vatapi': {
        target: this.baseUrl, // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/vatapi': '/',
        },
        headers: {
          //设置请求头
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/client/',
    proxyTable: {},

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    // host: 'localhost',
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },

  build: {
    // Template for index.html
    // 打包路径
    index: path.resolve(__dirname, '../dist/client/index.html'),

    // index:
    //   process.env.NODE_ENV === "production"
    //     ? path.resolve(__dirname, "../dist/index.html")
    //     : process.env.NODE_ENV === "uatenvironment"
    //     ? path.resolve(__dirname, "../uat/index.html")
    //     : process.env.NODE_ENV === "testing"
    //     ? path.resolve(__dirname, "../test/index.html")
    //     : process.env.NODE_ENV === "development"
    //     ? path.resolve(__dirname, "../dev/index.html")
    //     : path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist/client'),
    // assetsRoot:
    //   process.env.NODE_ENV === "production"
    //     ? path.resolve(__dirname, "../dist")
    //     : process.env.NODE_ENV === "uatenvironment"
    //     ? path.resolve(__dirname, "../uat")
    //     : process.env.NODE_ENV === "testing"
    //     ? path.resolve(__dirname, "../test")
    //     : process.env.NODE_ENV === "development"
    //     ? path.resolve(__dirname, "../dev")
    //     : path.resolve(__dirname, "../dist"),

    assetsSubDirectory: 'static',
    assetsPublicPath: '/client/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
};
