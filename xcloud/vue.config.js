const path = require('path');
const config = require('./src/config/index.js');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// 增加打包版本号
const VERSION = new Date().getTime();

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

const port = process.env.port || process.env.npm_config_port || 8080; // dev port

let BASE_URL = '/';
// switch (process.env.NODE_ENV) {
//   case "development":
//     BASE_URL = config.publicPath.dev; // 这里是本地的请求url
//     break;
//   case "production":
//     BASE_URL = config.publicPath.pro; // 生产环境url
//     break;
// }

module.exports = {
  // 项目部署基础
  // 默认情况下，我们假设你的应用将被部署在域的根目录下,
  // 例如：https://www.my-app.com/
  // 默认：'/'
  // 如果您的应用程序部署在子路径中，则需要在这指定子路径
  // 例如：https://www.foobar.com/my-app/
  // 需要将它改为'/my-app/'
  publicPath: BASE_URL,
  assetsDir: 'static',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    port: port,
    open: true,
    // 配置反向代理
    proxy: {
      '/python': {
        target: 'http://192.168.32.252:8888/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/python': '',
        },
      },
    },
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  // webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components'),
      },
    },
    plugins:
      // 在开发环境可以缓存加速启动
      process.env.NODE_ENV === 'development'
        ? [
            new HardSourceWebpackPlugin({
              // cacheDirectory 默认情况下将缓存存储在 node_modules 下的目录中，因此如果清除了node_modules，则缓存也是如此
              cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
              recordsPath: 'node_modules/.cache/hard-source/[confighash]/records.json',
              // configHash 在启动 webpack 实例时转换 webpack 配置，并用于cacheDirectory 为不同的 webpack 配置构建不同的缓存
              configHash: function (webpackConfig) {
                return require('node-object-hash')({
                  sort: false,
                }).hash(webpackConfig);
              },
              // 当加载器、插件、其他构建时脚本或其他动态依赖项发生更改时，hard-source 需要替换缓存以确保输出正确。
              // environmentHash 被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
              environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ['package-lock.json', 'yarn.lock'],
              },
            }),
          ]
        : [],
  },
  chainWebpack: (config) => {
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

    // not development
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
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
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
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
            enforce: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single');
    });

    // 打包js增加hash值防止页面缓存
    config.output.filename(`static/js/[name].js?v=${VERSION}`).chunkFilename(`static/js/[name].js?v=${VERSION}`).end();
  },
  // eslint-disable-next-line no-dupe-keys
  css: {
    // 打包css增加hash值防止页面缓存
    extract: {
      filename: `static/css/[name].css?v=${VERSION}`,
      chunkFilename: `static/css/[name].css?v=${VERSION}`,
    },
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
};
