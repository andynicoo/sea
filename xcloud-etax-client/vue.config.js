'use strict';
const path = require('path');
const defaultSettings = require('./src/settings.js');
// require spa plugin
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// 打包加入时间戳版本号
const VERSION = new Date().getTime();

// resolve
function resolve(dir) {
  return path.join(__dirname, dir);
}
// page title
const name = defaultSettings.title || '跨税云VAT_VAT注册/申报工作台';
// server port
const port = process.env.port || process.env.npm_config_port || 9000;

module.exports = {
  publicPath: '/client/',
  outputDir: 'dist/client',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false, // 取消eslint校验
  productionSourceMap: process.env.NODE_ENV === 'development' ? true : false, // 开发环境会开启sourcemap
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@comp': resolve('xcloud-client-components-web'),
      },
    },
    output: {
      filename: `static/js/[name].js?v=${VERSION}`,
      chunkFilename: `static/js/[name].js?v=${VERSION}`,
    },
    // plugins:
    //   // 非development环境，使用spa plugins
    //   process.env.NODE_ENV !== "development"
    //     ? [
    //         new PrerenderSPAPlugin({
    //           // // 生成文件的路径，和webpack配置的保持一致
    //           staticDir: path.join(__dirname, "dist"),
    //           // // 输出目录，和webpack配置的outputDir保持一致
    //           // outputDir: path.join(__dirname, "dist", "/"),
    //           // 指定入口html，这里必须写，否则打包不了
    //           // indexPath: path.join(__dirname, "dist", "/", "/index.html"),
    //           // 需要静态化页面的路由，会生成对应目录的静态文件，如果路由有参数，就需要写成 /home/param1。
    //           // routes: ["/aboutUs"],
    //           // 这个很重要，如果没有配置这段，也不会进行预编译
    //           renderer: new Renderer({
    //             inject: {
    //               foo: "bar",
    //             },
    //             headless: false,
    //             // 在 main.js 中实例化vue的mounted，document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
    //             renderAfterDocumentEvent: "render-event",
    //           }),
    //         }),
    //       ]
    //     : [],
  },
  chainWebpack: (config) => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      },
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch');

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();

    // 这里要设置 whitespace="preserve"，不然编译后会把 &nbsp; 符号去掉
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.whitespace = 'preserve';
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // is development
    config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-source-map'));

    // not development
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{ inline: /runtime\..*\.js$/ }])
        .end();

      // config optimization
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-viewUI', // split viewUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?view-design(.*)/, // in order to adapt to cnpm
          },
          echarts: {
            name: 'chunk-echarts',
            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            priority: 10,
          },
          styles: {
            name: 'styles', // split styles
            test: /\.(le|sa|sc|c)ss$/,
            priority: 10,
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk('single');
    });

    // 打包js增加hash值防止页面缓存
  },
  css: {
    // 打包css增加hash值防止页面缓存
    extract: {
      filename: `static/css/[name].css?v=${VERSION}`,
      chunkFilename: `static/css/[name].css?v=${VERSION}`,
    },
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          modifyVars: {
            'primary-color': '#3A7FFF',
            'link-color': '#3A7FFF',
            'border-radius-base': '0px',
            'table-bg-color': 'rgb(22, 173, 233)',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
