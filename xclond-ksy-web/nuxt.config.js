let PLA = process.env.NODE_PLA;

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // header信息全写在内页中
    // title: config[PLA].title,
    htmlAttrs: {
      lang: "zh-CN",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // {
      //   hid: "keywords",
      //   name: "keywords",
      //   content: ``,
      // },
      // {
      //   hid: "description",
      //   name: "description",
      //   content: ``,
      // },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: "/libs/sensorsdata.min.js",
      },
      {
        src: "https://kefu.easemob.com/webim/easemob.js",
      },
      // 百度统计代码混淆
      // {
      //   src: `\x68\x74\x74\x70\x73\x3a\x2f\x2f\x68\x6d\x2e\x62\x61\x69\x64\x75\x2e\x63\x6f\x6d\x2f\x68\x6d\x2e\x6a\x73?${
      //     process.env.NODE_PLA === "kby" ? "\x66\x31\x66\x35\x32\x33\x64\x33\x32\x65\x64\x66\x33\x36\x66\x65\x35\x62\x37\x39\x33\x38\x61\x31\x64\x64\x37\x62\x35\x65\x36\x61" : "\x36\x30\x61\x34\x35\x63\x32\x32\x62\x38\x30\x61\x30\x37\x34\x34\x35\x37\x36\x36\x66\x30\x33\x39\x64\x64\x62\x38\x36\x33\x36\x63"
      //   }`,
      // },
      {
        src: "https://g.alicdn.com/sd/ncpc/nc.js?t=2015052012",
      },
    ],
  },

  server: {
    // port: 80, // dev线上环境
    port: process.env.NODE_ENV === "dev" ? 7000 : 80, // 其他环境
    host: "0.0.0.0",
  },

  hooks: {
    "vue-renderer:ssr:context"(context) {
      const routePath = JSON.stringify(context.nuxt.routePath);
      context.nuxt = { serverRendered: true, routePath };
    },
  },

  watchQuery: true,

  env: {
    NODE_ENV: process.env.NODE_ENV,
    // 运行主体，跨税云 || 跨标云
    NODE_PLA: process.env.NODE_PLA,
    // 请求服务器地址
    SERVER_URL: process.env.SERVER_URL,
    // 神策地址
    SENSORS_RUL: "https://sc-rec.gstarsea.com/sa?project=default",
    SENSORS_RULPROD: "https://sc-rec.gstarsea.com/sa?project=production",
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/style-resources"],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    `@/assets/css/${PLA}.less`,
    "normalize.css/normalize.css",
    `@/assets/css/var.less`,
    {
      src: `~/assets/css/antd-variables.${PLA}.less`,
      lang: "less",
    },
  ],

  styleResources: {
    less: `@/assets/css/default.${PLA}.less`,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "@/plugins/antd-ui", ssr: true },
    "@/plugins/axios",
    { src: "@/plugins/mixins", ssr: false },
    { src: "@/plugins/loading", ssr: false },
    { src: "@/plugins/echarts", ssr: false },

    {
      src: "@/plugins/vue-lazyload",
      ssr: false,
    },
    {
      src: "@/plugins/swiper.js",
      ssr: false,
    },
    { src: "@/plugins/iconfont.js", ssr: false },
    { src: "@/plugins/iconfont-kby.js", ssr: false },
    { src: "@/plugins/sensors.js", ssr: false },
    { src: `@/plugins/easemob.${PLA}.js`, ssr: false },
    { src: `@/plugins/baidu.${PLA}.js`, ssr: false },
    { src: "@/plugins/bus.js", ssr: false },
    { src: "@/mixins/index.js", ssr: false }
  ],

  router: {
    middleware: "unknownRoute"
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    "~/components",
    "~/components/common",
    "~/components/index",
    "~/components/news",
    "~/components/about",
    "~/components/computed",
    "~/components/trademark",
    "~/components/search",
    "~/components/login",
    "~/components/trademark/static",
    "~/components/depot"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.SERVER_URL,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile: [/^element-ui/],
    analyze: false,
    vendor: ["axios"],
    loaders: {
      less: {
        javascriptEnabled: true,
      },
    },
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    extend(config, { isDev }) {
      config.module.rules.some((loader) => {
        if (loader.use) {
          const urlLoader = loader.use.find((use) => ~use.loader.indexOf("url-loader"));
          if (urlLoader) {
            // 0K, 图片不使用base64
            urlLoader.options.limit = 0;
            return true;
          }
        }
        return false;
      });
    },
  },
  buildDir: "nuxt-dist",

  loading: {
    color: "DodgerBlue",
    height: "2px",
    continuous: true,
    duration: 3000,
  },
};
