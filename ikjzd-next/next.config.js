const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

require("custom-env").env(process.env.APP_ENV);

const config = withBundleAnalyzer(
  withLess(
    withCSS({
      webpack: (config) => {
        /**
         * 此处可以自定义webpack配置
         */
        config.optimization.splitChunks.chunks = "initial";
        config.optimization.splitChunks.minSize = 10000000;
        return config;
      },
      /**
       * ant design 主题色、less变量配置
       */
      lessLoaderOptions: {
        modifyVars: {
          "primary-color": process.env.PRIMARY_COLOR,
          "link-color": process.env.LINK_COLORl,
          "background-color": process.env.BACKGROUND_COLOR,
          "container-width": process.env.CONTAINER_WIDTH,
          "ant-prefix": process.env.CLASS_PREFIX,
        },
        javascriptEnabled: true,
      },
      /**
       * 环境参数注入客户端
       */
      env: {
        PORT: process.env.PORT,
        CLIENT_API_URL: process.env.CLIENT_API_URL,
        APP_ENV: process.env.APP_ENV,
        TOKEN_KEY: process.env.TOKEN_KEY,
        EXPIRES_KEY: process.env.EXPIRES_KEY,
        ORIGINAL_PAGE: process.env.ORIGINAL_PAGE,
        CLASS_PREFIX: process.env.CLASS_PREFIX,
        PRIMARY_COLOR: process.env.PRIMARY_COLOR,
        LINK_COLORl: process.env.LINK_COLORl,
        BACKGROUND_COLOR: process.env.BACKGROUND_COLOR,
        CONTAINER_WIDTH: process.env.CONTAINER_WIDTH,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CLIENT_ID: process.env.CLIENT_ID,
      },
    })
  )
);

module.exports = config;
