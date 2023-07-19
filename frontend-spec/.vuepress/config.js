module.exports = {
  title: "前端开发文档",
  description: "公共组件开发文档，生产流程文档",
  port: "8899", //端口号
  head: [
    [
      "link",
      {
        rel: "icon",
        href: `/favicon.ico`,
      },
    ],
  ],
  themeConfig: {
    logo: "/assets/img/logo.svg",
    nav: [
      {
        text: "综合&工具",
        items: [
          {
            text: "中台xcloud",
            items: [
              {
                text: "xcloud 依赖说明",
                link: "/xcloud/xcloud依赖说明.html",
              },
            ],
          },
          {
            text: "辅助工具",
            items: [
              {
                text: "VueUse速查手册",
                link: "/client/VueUse速查手册.html",
              },
            ],
          },
        ],
      },
      {
        text: "各项目地址",
        items: [
          {
            text: "前端项目对照表",
            link: "https://alidocs.dingtalk.com/i/nodes/YndMj49yWjwBkBkOCxQgjxe2V3pmz5aA?utm_scene=person_space",
          },
          // {
          //   text: "跨标云",
          //   link: "https://chenhai-group.coding.net/p/xyunzhongtai/d/xcloud/git",
          // },
        ],
      },
      {
        text: "文档地址",
        link: "https://e.coding.net/chenhai-group/chenhaigonggongcangku/frontend-spec.git",
        target: "_blank",
      },
    ],
    lastUpdated: "更新时间",
    sidebar: [
      {
        title: "基础规范", // 必要的
        path: "/base/开发规范", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          "/base/开发规范",
          "/base/前端开发注意事项",
          "/base/git规范共识1.0",
          "/base/依赖说明",
          "/base/文档管理",
          "/base/监督执行办法",
          "/base/前端钉钉文档",
        ],
      },
      {
        title: "xcloud-项目",
        path: "/xcloud/特殊说明",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          "/xcloud/特殊说明",
          // "/xcloud/工具方法",
          "/xcloud/样式主题",
          "/xcloud/xcloud依赖说明",
          "/xcloud/重构工作环节梳理",
        ],
      },
      {
        title: "xcloud-admin项目",
        path: "/xcloudAdmin/说明",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          "/xcloudAdmin/说明",
          "/xcloudAdmin/组件介绍",
          "/xcloudAdmin/特别说明",
          "/xcloudAdmin/项目依赖",
        ],
      },
      {
        title: "跨税/标云官网(重构)",
        path: "/client/客户端重构工作",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          "/client/客户端重构工作",
          "/client/项目说明",
          "/client/跨税跨标官网依赖",
          "/client/VueUse速查手册",
        ],
      },
      {
        title: "微信小程序",
        path: "/wechat/特殊说明",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: ["/wechat/特殊说明"],
      },
    ],
  },
  // 插件配置
  plugins: [
    [
      "@vuepress/last-updated", // "上次更新"时间格式
      {
        transformer: (timestamp, lang) => {
          const dayjs = require("dayjs"); // https://day.js.org/
          return dayjs(timestamp).format("YYYY/MM/DD, HH:mm:ss");
        },
      },
    ],
    ["@vuepress/back-to-top"],
  ],
};
