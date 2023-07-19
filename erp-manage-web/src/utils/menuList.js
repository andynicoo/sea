export default [
  {
    menuId: 20,
    menuName: '数据概览',
    menuCode: 'overview',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/overview',
    icon: 'iconshujugailan',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    active: false,
    key: 'overview'
  },
  {
    menuId: 1,
    menuName: '用户管理',
    menuCode: 'user',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/usermanage',
    //   icon: 'icon-user-manage',
    icon: 'iconyonghuguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 22,
        menuName: '全部用户',
        menuCode: 'user_all',
        parentId: 1,
        parentIds: '0,1',
        sort: 100,
        path: '/usermanage/all-user',
        icon: '',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 23,
        menuName: '店铺列表',
        menuCode: 'user_shop',
        parentId: 1,
        parentIds: '0,1',
        sort: 100,
        path: '/usermanage/shop-list',
        icon: '',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 24,
        menuName: '邀请关系列表',
        menuCode: 'user_relationship',
        parentId: 1,
        parentIds: '0,1',
        sort: 100,
        path: '/usermanage/relationship',
        icon: '',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 25,
        menuName: '货代商列表',
        menuCode: 'user_forwarder',
        parentId: 1,
        parentIds: '0,1',
        sort: 100,
        path: '/usermanage/forwarder',
        // icon: 'iconuser-forwarder',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 26,
        menuName: '供应商管理',
        menuCode: 'user_supplier',
        parentId: 1,
        parentIds: '0,1',
        sort: 100,
        path: '/usermanage/supplier',
        // icon: 'iconuser-forwarder',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 99,
    menuName: '会员管理',
    menuCode: 'menber',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/menbermanage',
    //   icon: 'icon-cash-mange',
    icon: 'iconwangbiguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 100,
        menuName: '会员套餐管理',
        menuCode: 'member_shippackage',
        parentId: 99,
        parentIds: '0,99',
        sort: 100,
        path: '/menbermanage/index',
        // icon: 'iconcash-record',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 6,
    menuName: '旺币管理',
    menuCode: 'cash',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/cashmanage',
    //   icon: 'icon-cash-mange',
    icon: 'iconwangbiguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 7,
        menuName: '旺币记录',
        menuCode: 'cash_record',
        parentId: 6,
        parentIds: '0,6',
        sort: 100,
        path: '/cashmanage/cash-record',
        // icon: 'iconcash-record',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 8,
        menuName: '任务设置',
        menuCode: 'cash_setting',
        parentId: 6,
        parentIds: '0,6',
        sort: 100,
        path: '/cashmanage/task-setting',
        // icon: 'icontask-setting',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 9,
    menuName: 'ERP内容管理',
    menuCode: 'content',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/content',
    //   icon: 'icon-content',
    icon: 'iconERP',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 10,
        menuName: 'Q&A',
        menuCode: 'content_list',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/content-list',
        // icon: 'iconcontent-list',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 11,
        menuName: '意见反馈',
        menuCode: 'content_feedback',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/feedback',
        // icon: 'iconfeed-back',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 12,
        menuName: '一键开店',
        menuCode: 'content_apply_store',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/apply-store',
        // icon: 'iconapply-store',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 15,
        menuName: '失败原因',
        menuCode: 'content_fail_reason',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/fail-reason',
        // icon: 'icon-fail-cause',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 16,
        menuName: '使用说明',
        menuCode: 'content_use_direction',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/use-direction',
        // icon: 'icon-fail-cause',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 17,
        menuName: '产品动态',
        menuCode: 'content_news_products',
        parentId: 9,
        parentIds: '0,9',
        sort: 100,
        path: '/content/news-products',
        // icon: 'icon-fail-cause',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 30,
    menuName: '官网内容管理',
    menuCode: 'website',
    parentId: 0,
    path: '/website',
    icon: 'iconguanwang',
    children: [
      {
        menuId: 31,
        menuName: '新闻动态管理',
        menuCode: 'news_manager',
        parentId: 30,
        auth: true,
        path: '/website/news'
      },
      // {
      //   menuId: 32,
      //   menuName: '使用帮助管理',
      //   menuCode: 'using_help_manager',
      //   parentId: 30,
      //   path: '/website/using-help'
      // },
      {
        menuId: 33,
        menuName: '案例管理',
        menuCode: 'case_manager',
        parentId: 30,
        path: '/website/case'
      },
      {
        menuId: 34,
        menuName: '广告管理',
        menuCode: 'advertising',
        parentId: 30,
        path: '/website/advertising'
      }
    ]
  },
  {
    menuId: 13,
    menuName: '财务管理',
    menuCode: 'account',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/account',
    //   icon: 'icon-financing',
    icon: 'iconcaiwuguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 14,
        menuName: '提现审批',
        parentId: 13,
        parentIds: '0,13',
        sort: 100,
        path: '/account/take-account',
        menuCode: 'account_take_account',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 18,
    menuName: '账户管理',
    menuCode: 'accounts',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/accounts',
    // icon: 'icon-financing',
    icon: 'iconzhanghaoguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 19,
        menuName: '货代商账户列表',
        parentId: 18,
        parentIds: '0,18',
        sort: 100,
        path: '/accounts/accounts-list',
        menuCode: 'accounts_list',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 26,
        menuName: '货代商账户归类',
        parentId: 18,
        parentIds: '0,18',
        sort: 100,
        path: '/accounts/accounts-classification',
        menuCode: 'accounts_classification',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      },
      {
        menuId: 27,
        menuName: '海外仓服务商列表',
        parentId: 18,
        parentIds: '0,18',
        sort: 100,
        path: '/accounts/accounts-sealist',
        menuCode: 'accounts_sealist',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  },
  {
    menuId: 21,
    menuName: '权限管理',
    menuCode: 'role',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/authManage',
    icon: 'iconquanxian',
    children: [
      {
        menuId: 22,
        menuName: '后台员工管理',
        menuCode: 'role_distribute',
        parentId: 21,
        parentIds: '0',
        sort: 100,
        path: '/authManage/role-allocation'
      },
      {
        menuId: 23,
        menuName: '后台角色管理',
        menuCode: 'role_setting',
        parentId: 21,
        parentIds: '0',
        sort: 100,
        path: '/authManage/role-auth'
      },
      {
        menuId: 26,
        menuName: '后台菜单管理',
        auth: true,
        menuCode: 'menu_manage',
        parentId: 21,
        parentIds: '0',
        sort: 100,
        path: '/authManage/menu-manage'
      },
      {
        menuId: 24,
        menuName: 'ERP角色管理',
        menuCode: 'erp_role_manage',
        parentId: 21,
        parentIds: '0',
        sort: 100,
        path: '/authManage/erp-role-manage'
      },
      {
        menuId: 25,
        menuName: 'ERP菜单管理',
        menuCode: 'erp_menu_manage',
        parentId: 21,
        parentIds: '0',
        sort: 100,
        path: '/authManage/erp-menu-manage'
      }
    ]
  },
  {
    menuId: 1001,
    menuName: '统计分析',
    menuCode: 'statis',
    parentId: 0,
    parentIds: '0',
    sort: 100,
    path: '/forwarder',
    //   icon: 'icon-financing',
    icon: 'iconcaiwuguanli',
    menuI18n: '',
    pathType: 0,
    childrenMenu: null,
    children: [
      {
        menuId: 2001,
        menuName: '货代商综合统计',
        parentId: 1001,
        parentIds: '0,1001',
        sort: 100,
        path: '/forwarder/statis-list',
        menuCode: 'forwarder_statis_list',
        menuI18n: '',
        pathType: 0,
        childrenMenu: null
      }
    ],
    active: false
  }
]
