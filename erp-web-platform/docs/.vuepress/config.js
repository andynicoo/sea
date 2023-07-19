module.exports = {
  title: '马六甲前端开发文档',
  description: 'erp公共组件开发文档，生产流程文档',
  themeConfig: {
    logo: '/assets/img/logo.png',
    nav: [
      {
        text: 'git',
        link: 'https://gitlab.ikjzd.com/kj_erp/web',
        target: '_blank'
      },
      {
        text: '各项目地址',
        items: [
          { text: '官网', link: 'https://emalacca.com/' },
          { text: 'ERP', link: 'https://erp.emalacca.com/' },
          { text: 'TMS', link: 'https://tms.emalacca.com/' },
          { text: 'WMS', link: 'https://wms.emalacca.com/' },
          { text: '运营后台', link: 'http://mg-erp.emalacca.com/' }
        ]
      }
    ],
    sidebar: [
      {
        title: '基础', // 必要的
        path: '/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          '/base/开发规范',
          '/base/更新日志',
          '/base/样式主题',
          '/base/工具方法',
          '/base/前端开发注意事项',
          '/base/规范组件文档示例',
          '/base/git规范共识1.0',
          '/base/资源',
          '/base/重构工作环节梳理'
        ]
      },
      {
        title: '组件',
        path: '/',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          '/components/CheckList',
          '/components/DocExample',
          '/components/EmojiArea',
          '/components/Emoji',
          '/components/FabricCanvas',
          '/components/HumanVerify',
          '/components/LangSelect',
          '/components/Logo',
          '/components/Pagination',
          '/components/PreviewPicture',
          '/components/StoreSelect',
          '/components/ThemeSettings',
          '/components/Upload',
          '/components/VersionUpdateTips',
          '/components/ViewImg',
          '/components/WatermarkTemplate',
          '/components/layouts/Footer',
          '/components/layouts/Header',
          '/components/layouts/HeaderNav',
          '/components/layouts/LayoutDefault',
          '/components/layouts/LayoutAuth',
          '/components/layouts/LayoutPublic',
          '/components/layouts/LeftMenu',
          '/components/layouts/RouteWrapper',
          '/components/layouts/MobileLayout',
          '/components/searchForm/FormItem',
          '/components/tree/Tree',
          '/components/tree/TreeItem',
          '/components/widgets/NotificationList'
        ]
      }
    ]
  }
}
