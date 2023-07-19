const path = require('path')
const TimeStamp = new Date().getTime()
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // publicPath: './', //很重要
  productionSourceMap: false,
  outputDir: 'dist',
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/theme/default.scss')]
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch'),
      config.resolve.alias
        .set('@', resolve('./src'))
        .set('components', resolve('./src/components'))
        .set('views', resolve('src/views'))
        .set('assets', resolve('src/assets'))
    //set第一个参数：设置的别名，第二个参数：设置的路径
    // config.module.rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({ bypassOnDebug: true })
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        // other modules
        introJs: ['intro.js']
      }
    ])
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#FF6B38',
            'link-color': '#4C86FF',
            'error-color': '#FF4A4A',
            'warning-color': '#FFAD42',
            'success-color': '#67C23A',
            'box-shadow-base': '0 1px 1px rgba(0, 0, 0, 0.15)'
          },
          javascriptEnabled: true
        }
      },
      sass: {},
      scss: {
        prependData: `@import "./src/theme/default.scss";`
      }
    }
  },
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      },
      '/local': {
        target: 'http://127.0.0.1:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/local/': '/'
        }
      },
      '/senlin': {
        target: 'http://192.168.50.70:9999/',
        changeOrigin: true,
        pathRewrite: {
          '^/senlin/': '/'
        }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: () => {
    if (!isDev) {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            test: /\.js$|\.html$|\.css$/,
            // 超过4kb压缩
            threshold: 4096
          })
        ],
        output: {
          filename: `static/js/[name].[chunkhash].js`,
          chunkFilename: `static/js/[name].[chunkhash].js`
        }
      }
    }
  },

  assetsDir: 'static',
  runtimeCompiler: true
}
