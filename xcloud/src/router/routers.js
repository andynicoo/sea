import Main from '@/components/main';
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
    },
    component: () => import('@/view/login/login.vue'),
  },
  {
    path: '/processConfiguration',
    name: 'ProcessConfiguration',
    meta: {
      title: '流程配置',
      hideInMenu: true,
    },
    component: () => import('@/view/module/workOrder/processConfiguration/processConfiguration.vue'),
  },
  {
    path: '/transferWorkOrder',
    name: 'transferWorkOrder',
    meta: {
      title: '转入工单',
      hideInMenu: true,
    },
    component: () => import('@/view/module/workOrder/processConfiguration/transferWorkOrder.vue'),
  },
  {
    path: '/processPreview',
    name: 'processPreview',
    meta: {
      title: '流程预览',
      hideInMenu: true,
    },
    component: () => import('@/view/module/workOrder/processConfiguration/processPreview.vue'),
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home',
        },
        component: () => import('@/view/home'),
      },
      {
        path: '/register',
        name: 'register',
        meta: {
          hideInMenu: true,
          title: '注册税号列表',
          notCache: true,
          icon: 'md-home',
        },
        component: () => import('@/view/home/common/register'),
      },
      {
        path: '/turnToAgent',
        name: 'turnToAgent',
        meta: {
          hideInMenu: true,
          title: '转代理列表',
          notCache: true,
          icon: 'md-home',
        },
        component: () => import('@/view/home/common/turnToAgent'),
      },
      {
        path: '/declare',
        name: 'declare',
        meta: {
          hideInMenu: true,
          title: '申报列表',
          notCache: true,
          icon: 'md-home',
        },
        component: () => import('@/view/home/common/declare'),
      },
      {
        path: '/searchService',
        name: 'searchService',
        meta: {
          hideInMenu: true,
          title: '服务查询结果',
          notCache: true,
          icon: 'md-home',
        },
        component: () => import('@/view/home/common/searchService'),
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: 'setting',
        name: 'setting',
        meta: {
          icon: 'md-notifications',
          title: '个人设置',
        },
        component: () => import('@/view/module/account/setting.vue'),
      },
      {
        path: 'computeTax',
        name: 'computeTax',
        meta: {
          icon: 'md-notifications',
          title: '计算税金',
        },
        component: () => import('@/view/module/taxService/workOrderManage/taxDeclare/components/computeTax.vue'),
      },
    ],
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集',
        },
        component: () => import('@/view/error-page/error-logger.vue'),
      },
    ],
  },
  {
    path: '/login/success',
    name: 'loginSuccess',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/login/login-success.vue'),
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/401.vue'),
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/500.vue'),
  },
  {
    path: '/userlist',
    name: 'client',
    meta: {
      hideInBread: true,
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        meta: {
          title: '用户详情',
        },
        component: () => import('@/view/module/user/user/userInfo.vue'),
      },
    ],
  },
  {
    path: '/orderInfo',
    name: 'orderInfo',
    meta: {
      hideInBread: true,
      hideInMenu: true,
    },
    component: Main,
    children: [
      {
        path: '/orderDetail',
        name: 'orderDetail',
        meta: {
          title: '订单详情',
        },
        component: () => import('@/view/module/taxService/orderManage/components/OrderDetail.vue'),
      },
      {
        path: '/iiptoOrderDetail',
        name: 'iiptoOrderDetail',
        meta: {
          title: '跨标云订单详情',
        },
        component: () => import('@/view/module/iipto/orderManage/components/orderDetail.vue'),
      },
    ],
  },

  // 新的导航栏 -运营中心
  {
    path: '/operations',
    name: 'operations',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/firm/addEdit',
        name: 'addEdit',
        meta: {
          title: '新增/编辑',
        },
        component: () => import('@/view/module/operations/firm/addEdit.vue'),
      },
      {
        path: '/firm/detail',
        name: 'detail',
        meta: {
          title: '详情',
        },
        component: () => import('@/view/module/operations/firm/detail.vue'),
      },
      {
        path: '/staffManagement/addEdit',
        name: 'agementAddEdit',
        meta: {
          title: '员工新增/编辑',
        },
        component: () => import('@/view/module/operations/staffManagement/addEdit.vue'),
      },
      {
        path: '/staffManagement/detail',
        name: 'agementDetail',
        meta: {
          title: '查看',
        },
        component: () => import('@/view/module/operations/staffManagement/detail.vue'),
      },
      {
        path: '/staffManagement/Authority',
        name: 'agementauthority',
        meta: {
          title: '企业权限',
        },
        component: () => import('@/view/module/operations/staffManagement/authority.vue'),
      },
    ],
  },
  // 帮助中心
  {
    path: '/helpcenter',
    name: 'helpcenter',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/helpcenter/index',
        name: 'index',
        meta: {
          icon: 'md-notifications',
          title: '帮助中心',
        },
        component: () => import('@/view/module/helpCenter/index.vue'),
      },
    ],
  },
  // 基础资料
  {
    path: '/basementpaper',
    name: 'basementpaper',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/basementpaper/bankaccount/addbank',
        name: 'addbank',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/basementPaper/bank/addOrEdit.vue'),
      },

      {
        path: '/basementpaper/tax/addtax',
        name: 'addtax',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/basementPaper/tax/addOrEdit.vue'),
      },

      {
        path: '/basementpaper/country/addcountry',
        name: 'addcountry',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/basementPaper/country/addOrEdit.vue'),
      },
    ],
  },
  // 服务商品
  {
    path: '/servicemerchant',
    name: 'servicemerchant',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/servicemerchant/merchant/addmerchant',
        name: 'addmerchant',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/serviceMerchant/merchant/addOrEdit.vue'),
      },
      {
        path: '/serviceMerchant/channelGoods/goodsAttribute',
        name: 'goodsAttribute',
        meta: {
          icon: 'md-notifications',
          title: '商品属性管理',
        },
        component: () => import('@/view/module/serviceMerchant/channelGoods/goodsAttribute.vue'),
      },
      {
        path: '/serviceMerchant/channelGoods/addEditAttachspecs',
        name: 'addEditAttachspecs',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/serviceMerchant/channelGoods/addEditAttachspecs.vue'),
      },
      {
        path: '/servicemerchant/merchant/detail',
        name: 'merchantdetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/serviceMerchant/merchant/detail.vue'),
      },
      // 渠道详情
      {
        path: '/servicemerchant/channelGoods/detail',
        name: 'channelGoodsDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/serviceMerchant/channelGoods/detail.vue'),
      },
    ],
  },
  // 客户管理
  {
    path: '/customer',
    name: 'customer',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/customer/detail',
        name: 'customerDetail',
        meta: {
          title: '详情',
        },
        component: () => import('@/view/module/customer/customerInfo/detail.vue'),
      },
      {
        path: '/billManage/detail',
        name: 'billManageDetail',
        meta: {
          title: '详情',
        },
        component: () => import('@/view/module/customer/billManage/detail.vue'),
      },
      {
        path: '/myCustomer/detail',
        name: 'customerInfoDetail',
        meta: {
          title: '详情',
        },
        component: () => import('@/view/module/customer/myCustomer/detail.vue'),
      },
      {
        path: '/companyInfo/addOrEdit',
        name: 'companyInfoAddOrEdit',
        meta: {
          title: '新增编辑',
        },
        component: () => import('@/view/module/customer/companyInfo/addOrEdit.vue'),
      },
      {
        path: '/companyInfo/detail',
        name: 'companyInfoDetail',
        meta: {
          title: '详情',
        },
        component: () => import('@/view/module/customer/companyInfo/detail.vue'),
      },
    ],
  },
  // 营销推广
  {
    path: '/extension',
    name: 'extension',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/extension/promotionExtend/line/addEdit',
        name: 'extendaddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/extension/promotionExtend/line/addEdit.vue'),
      },
      {
        path: '/extension/promotionExtend/staff/add/add',
        name: 'extendStaffAdd',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/extension/promotionExtend/staff/add/add.vue'),
      },
      {
        path: '/extension/promotionExtend/line/detail',
        name: 'extendDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/extension/promotionExtend/line/detail.vue'),
      },
      {
        path: '/extension/promotionExtend/staff/detail/detail',
        name: 'extendStaffDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/extension/promotionExtend/staff/detail/detail.vue'),
      },
      {
        path: '/extension/activityManagement/secondsKillActivity',
        name: 'secondsKillActivity',
        meta: {
          icon: 'md-notifications',
          title: '秒杀活动',
        },
        component: () => import('@/view/module/extension/activityManagement/secondsKillActivity.vue'),
      },
      {
        path: '/extension/activityManagement/editActivity',
        name: 'editActivity',
        meta: {
          icon: 'md-notifications',
          title: '秒杀活动',
        },
        component: () => import('@/view/module/extension/activityManagement/editActivity.vue'),
      },
      {
        path: '/extension/renewalDiscount/addOrEdit',
        name: 'addOrEditRenewalDiscount',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/extension/renewalDiscount/addOrEdit.vue'),
      },
      {
        path: '/extension/activityManagement/coupon/index',
        name: 'coupon',
        meta: {
          icon: 'md-notifications',
          title: '优惠劵管理',
        },
        component: () => import('@/view/module/extension/activityManagement/coupon/index.vue'),
      },
      {
        path: '/extension/activityManagement/coupon/addEdit',
        name: 'couponAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '优惠劵管理',
        },
        component: () => import('@/view/module/extension/activityManagement/coupon/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/integral/index',
        name: 'integral',
        meta: {
          icon: 'md-notifications',
          title: '积分商城',
        },
        component: () => import('@/view/module/extension/activityManagement/integral/index.vue'),
      },
      {
        path: '/extension/activityManagement/integral/addEdit',
        name: 'couponAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '编辑商品',
        },
        component: () => import('@/view/module/extension/activityManagement/integral/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/draw/index',
        name: 'draw',
        meta: {
          icon: 'md-notifications',
          title: '幸运抽奖',
        },
        component: () => import('@/view/module/extension/activityManagement/draw/index.vue'),
      },
      {
        path: '/extension/activityManagement/draw/addEdit',
        name: 'drawAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '编辑抽奖',
        },
        component: () => import('@/view/module/extension/activityManagement/draw/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/draw/editPrize',
        name: 'draweEditPrize',
        meta: {
          icon: 'md-notifications',
          title: '编辑奖品',
        },
        component: () => import('@/view/module/extension/activityManagement/draw/editPrize.vue'),
      },
      {
        path: '/extension/activityManagement/draw/record',
        name: 'draweRecord',
        meta: {
          icon: 'md-notifications',
          title: '抽奖记录',
        },
        component: () => import('@/view/module/extension/activityManagement/draw/record.vue'),
      },
      {
        path: '/extension/activityManagement/together/index',
        name: 'together',
        meta: {
          icon: 'md-notifications',
          title: '拼团活动',
        },
        component: () => import('@/view/module/extension/activityManagement/together/index.vue'),
      },
      {
        path: '/extension/activityManagement/together/addEdit',
        name: 'togetherAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '编辑拼团',
        },
        component: () => import('@/view/module/extension/activityManagement/together/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/together/record',
        name: 'togetherRecord',
        meta: {
          icon: 'md-notifications',
          title: '拼团记录',
        },
        component: () => import('@/view/module/extension/activityManagement/together/record.vue'),
      },
      {
        path: '/extension/activityManagement/card/addEdit',
        name: 'cardAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '会员卡编辑',
        },
        component: () => import('@/view/module/extension/activityManagement/card/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/card/equity',
        name: 'cardEquity',
        meta: {
          icon: 'md-notifications',
          title: '权益设置',
        },
        component: () => import('@/view/module/extension/activityManagement/card/equity.vue'),
      },
      {
        path: '/extension/activityManagement/praise/index',
        name: 'praise',
        meta: {
          icon: 'md-notifications',
          title: '集赞助力',
        },
        component: () => import('@/view/module/extension/activityManagement/praise/index.vue'),
      },
      {
        path: '/extension/activityManagement/praise/addEdit',
        name: 'praiseEdit',
        meta: {
          icon: 'md-notifications',
          title: '编辑集赞',
        },
        component: () => import('@/view/module/extension/activityManagement/praise/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/praise/record',
        name: 'praiseRecord',
        meta: {
          icon: 'md-notifications',
          title: '集赞明细',
        },
        component: () => import('@/view/module/extension/activityManagement/praise/record.vue'),
      },

      {
        path: '/extension/activityManagement/guess/index',
        name: 'guess',
        meta: {
          icon: 'md-notifications',
          title: '疯狂猜猜猜',
        },
        component: () => import('@/view/module/extension/activityManagement/guess/index.vue'),
      },
      {
        path: '/extension/activityManagement/topicManage/index',
        name: 'topicManage',
        meta: {
          icon: 'md-notifications',
          title: '题目管理',
        },
        component: () => import('@/view/module/extension/activityManagement/topicManage/index.vue'),
      },
      {
        path: '/extension/activityManagement/guess/addEdit',
        name: 'guessAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '创建猜猜猜活动',
        },
        component: () => import('@/view/module/extension/activityManagement/guess/addEdit.vue'),
      },

      {
        path: '/extension/activityManagement/guess/record',
        name: 'guessRecord',
        meta: {
          icon: 'md-notifications',
          title: '答题记录',
        },
        component: () => import('@/view/module/extension/activityManagement/guess/record.vue'),
      },
      {
        path: '/extension/activityManagement/presse/index',
        name: 'presse',
        meta: {
          icon: 'md-notifications',
          title: '砍价活动',
        },
        component: () => import('@/view/module/extension/activityManagement/presse/index.vue'),
      },
      {
        path: '/extension/activityManagement/presse/record',
        name: 'presseRecord',
        meta: {
          icon: 'md-notifications',
          title: '砍价活动',
        },
        component: () => import('@/view/module/extension/activityManagement/presse/record.vue'),
      },
      {
        path: '/extension/activityManagement/presse/recordDel',
        name: 'presseRecordDel',
        meta: {
          icon: 'md-notifications',
          title: '砍价明细',
        },
        component: () => import('@/view/module/extension/activityManagement/presse/recordDel.vue'),
      },
      {
        path: '/extension/activityManagement/presse/addEdit',
        name: 'presseEdit',
        meta: {
          icon: 'md-notifications',
          title: '编辑砍价',
        },
        component: () => import('@/view/module/extension/activityManagement/presse/addEdit.vue'),
      },
      {
        path: '/extension/activityManagement/deposit/index',
        name: 'deposit',
        meta: {
          icon: 'md-notifications',
          title: '定金膨胀活动',
        },
        component: () => import('@/view/module/extension/activityManagement/deposit/index.vue'),
      },
      {
        path: '/extension/activityManagement/deposit/record',
        name: 'depositRecord',
        meta: {
          icon: 'md-notifications',
          title: '预售活动记录',
        },
        component: () => import('@/view/module/extension/activityManagement/deposit/record.vue'),
      },
      {
        path: '/extension/activityManagement/deposit/addEdit',
        name: 'depositEdit',
        meta: {
          icon: 'md-notifications',
          title: '创建定金膨胀活动',
        },
        component: () => import('@/view/module/extension/activityManagement/deposit/addEdit.vue'),
      },
    ],
  },

  // 财务管理
  {
    path: '/invoice',
    name: 'invoice',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/finance/invoice/invoiceDetails',
        name: 'invoiceDetails',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/finance/invoice/invoiceDetails.vue'),
      },
    ],
  },
  // 退款订单
  {
    path: '/refundorder',
    name: 'refundorder',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/refundorder/detail',
        name: 'refundorderDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看订单',
        },
        component: () => import('@/view/module/refundorder/detail.vue'),
      },
    ],
  },
  // 销售订单
  {
    path: '/salesorder',
    name: 'salesorder',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/salesOrder/detail',
        name: 'salesorderdetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/salesorder/detail/detail.vue'),
      },
    ],
  },
  {
    path: '/contractManage',
    name: 'contractManage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/contractManage/detail',
        name: 'contractManageDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/contractManage/detail/detail.vue'),
      },
    ],
  },
  // 供应链-服务商管理
  {
    path: '/serviceprovider',
    name: 'serviceprovider',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/serviceprovider/addEdit',
        name: 'serviceproviderAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/supplychain/serviceproviderManage/addEdit.vue'),
      },
      {
        path: '/serviceprovider/detail',
        name: 'serviceproviderDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/supplychain/serviceproviderManage/detail.vue'),
      },
    ],
  },
  // 供应链-律师管理
  {
    path: '/lawyermanage',
    name: 'lawyermanage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/lawyermanage/addEdit',
        name: 'lawyermanageAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/supplychain/lawyerManage/addEdit.vue'),
      },
      {
        path: '/lawyermanage/detail',
        name: 'lawyermanageDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/supplychain/lawyerManage/detail.vue'),
      },
    ],
  },
  // 供应链-分配规则
  {
    path: '/allocationrules',
    name: 'allocationrules',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/allocationrules/addEdit',
        name: 'allocationrulesAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/supplychain/allocationRules/addEdit.vue'),
      },
      {
        path: '/allocationrules/detail',
        name: 'allocationrulesDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/supplychain/allocationRules/detail.vue'),
      },
    ],
  },
  // 服务商品-商标分类
  {
    path: '/trademarkSubclass',
    name: 'trademarkSubclass',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/trademarkSubclass/import',
        name: 'trademarkSubclassImport',
        meta: {
          icon: 'md-notifications',
          title: '一键导入',
        },
        component: () => import('@/view/module/serviceMerchant/trademark/importSubclass.vue'),
      },
    ],
  },
  // 系统管理-用户管理
  {
    path: '/systemuser',
    name: 'systemuser',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/system/user/addEdit',
        name: 'systemuserAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增修改',
        },
        component: () => import('@/view/module/system/user/addEdit.vue'),
      },
      {
        path: '/systemuser/distributeRole',
        name: 'systemuserDistributeRole',
        meta: {
          icon: 'md-notifications',
          title: '权限分配',
        },
        component: () => import('@/view/module/system/user/distributeRole.vue'),
      },
    ],
  },
  // 自动分配处理人
  {
    path: '/assignProcessor',
    name: 'assignProcessor',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/assignProcessor/addEdit',
        name: 'assignProcessorAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/supplychain/assignProcessor/addEdit.vue'),
      },
      {
        path: '/assignProcessor/detail',
        name: 'assignProcessorDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/supplychain/assignProcessor/detail.vue'),
      },
    ],
  },
  // 系统管理-岗位体系数据规则
  {
    path: '/systemposition',
    name: 'systemposition',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/system/position/addEdit',
        name: 'systempositionAddEdit',
        meta: {
          icon: 'md-notifications',
          title: '新增修改',
        },
        component: () => import('@/view/module/system/position/addEdit.vue'),
      },
    ],
  },
  // 消息中心-信件管理，公告管理
  {
    path: '/letterManage',
    name: 'letterManage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/letterManage/add',
        name: 'letterManageAdd',
        meta: {
          icon: 'md-notifications',
          title: '发送信件',
        },
        component: () => import('@/view/module/messageCenter/letterManage/add.vue'),
      },
      {
        path: '/letterManage/detail',
        name: 'letterManageDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看信件详情',
        },
        component: () => import('@/view/module/messageCenter/letterManage/detail.vue'),
      },
      {
        path: '/noticeManage/add',
        name: 'noticeManageAdd',
        meta: {
          icon: 'md-notifications',
          title: '发送公告',
        },
        component: () => import('@/view/module/messageCenter/noticeManage/add.vue'),
      },
      {
        path: '/noticeManage/detail',
        name: 'noticeManageDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/messageCenter/noticeManage/detail.vue'),
      },
      {
        path: '/templateManage/addTemplate',
        name: 'addLetterTemplate',
        meta: {
          icon: 'md-notifications',
          title: '新增模板',
        },
        component: () => import('@/view/module/messageCenter/templateManage/addTemplate.vue'),
      },
    ],
  },
  // 资讯管理
  {
    path: '/consultingManage',
    name: 'consultingManage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/consultingList/add',
        name: 'consultingListAdd',
        meta: {
          icon: 'md-notifications',
          title: '发布文章',
        },
        component: () => import('@/view/module/consultingManage/consultingList/add.vue'),
      },
      {
        path: '/consultingList/detail',
        name: 'consultingListDetail',
        meta: {
          icon: 'md-notifications',
          title: '资讯详情',
        },
        component: () => import('@/view/module/consultingManage/consultingList/detail.vue'),
      },
      {
        path: '/caseList/add',
        name: 'caseListAdd',
        meta: {
          icon: 'md-notifications',
          title: '发布案例',
        },
        component: () => import('@/view/module/consultingManage/consultingList/add.vue'),
      },
      {
        path: '/caseList/tags',
        name: 'tagsmanage',
        meta: {
          icon: 'md-notifications',
          title: '标签管理',
        },
        component: () => import('@/view/module/consultingManage/consultingList/tags.vue'),
      },
      {
        path: '/operationInstru/add',
        name: 'operationInstruAdd',
        meta: {
          icon: 'md-notifications',
          title: '新增/编辑',
        },
        component: () => import('@/view/module/consultingManage/operationInstru/add.vue'),
      },
      {
        path: '/operationInstru/detail',
        name: 'operationInstruDetail',
        meta: {
          icon: 'md-notifications',
          title: '操作指引详情',
        },
        component: () => import('@/view/module/consultingManage/operationInstru/detail.vue'),
      },
      {
        path: '/systemNotice/detail',
        name: 'systemNoticeDetail',
        meta: {
          icon: 'md-notifications',
          title: '系统公告',
        },
        component: () => import('@/view/module/consultingManage/systemNotice/detail.vue'),
      },
    ],
  },
  // 税务转代理
  {
    path: '/serviceManage',
    name: 'serviceManage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/serviceManage/taxInfo',
        name: 'taxInfo',
        meta: {
          icon: 'md-notifications',
          title: '税务转代理',
        },
        component: () => import('@/view/module/newTaxServices/serviceManage/deatil.vue'),
      },
      {
        path: '/serviceManage/taxRegisterInfo',
        name: 'taxRegisterInfo',
        meta: {
          icon: 'md-notifications',
          title: '税号注册',
        },
        component: () => import('@/view/module/newTaxServices/taxRegister/deatil.vue'),
      },
    ],
  },
  // 税务转代理
  {
    path: '/internalServiceManage',
    name: 'internalServiceManage',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/internalServiceManage/taxInfo',
        name: 'internalTaxInfo',
        meta: {
          icon: 'md-notifications',
          title: '内部税务转代理',
        },
        component: () => import('@/view/module/newTaxServices/internalServiceManage/deatil.vue'),
      },
      {
        path: '/internalServiceManage/taxRegisterInfo',
        name: 'internalTaxRegisterInfo',
        meta: {
          icon: 'md-notifications',
          title: '税号注册',
        },
        component: () => import('@/view/module/newTaxServices/taxRegister/deatil.vue'),
      },
    ],
  },
  // 税务申报
  {
    path: '/newTaxServices',
    name: 'newTaxServices',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/newTaxServices/taxNumDeclare/detail',
        name: 'taxNumDeclareDetail',
        meta: {
          icon: 'md-notifications',
          title: '申报详情',
        },
        component: () => import('@/view/module/newTaxServices/taxNumDeclare/detail.vue'),
      },
      {
        path: '/newTaxServices/taxNumDeclare/submit',
        name: 'taxNumDeclareSubmit',
        meta: {
          icon: 'md-notifications',
          title: '提交申报',
        },
        component: () => import('@/view/module/newTaxServices/taxNumDeclare/submit.vue'),
      },
    ],
  },
  // 极简工单
  {
    path: '/simpleWorkOrder',
    name: 'simpleWorkOrder',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/VATOtherService/detail',
        name: 'VATOtherServiceDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/simpleWorkOrder/VATOtherService/detail.vue'),
      },
    ],
  },
  // 工单
  {
    path: '/workOrder',
    name: 'workOrder',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      // 英代欧代
      {
        path: '/authorizedRepresent/detail',
        name: 'authorizedRepresentDetail',
        meta: {
          icon: 'md-notifications',
          title: '查看详情',
        },
        component: () => import('@/view/module/workOrder/authorizedRepresent/detail.vue'),
      },
      // 海牙认证
      {
        path: '/hyCertification/detail',
        name: 'hyCertificationDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/hyCertification/detail.vue'),
      },
      // 税务稽查
      {
        path: '/taxInspection/detail',
        name: 'taxInspectionDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/taxInspection/detail.vue'),
      },
      // 注销税号
      {
        path: '/logoutTaxNum/detail',
        name: 'logoutTaxNumDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/logoutTaxNum/detail.vue'),
      },
      // vat退税
      {
        path: '/taxRefund/detail',
        name: 'taxRefundDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/taxRefund/detail.vue'),
      },
      // 增值服务
      {
        path: '/valueAddedServices/detail',
        name: 'valueAddedServicesDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/valueAddedServices/detail.vue'),
      },
      // 查一查
      {
        path: '/query/detail',
        name: 'queryDetail',
        meta: {
          icon: 'md-notifications',
          title: '工单详情',
        },
        component: () => import('@/view/module/workOrder/query/detail.vue'),
      },
      // 查一查
      {
        path: '/query/orderDetail',
        name: 'queryOrderDetail',
        meta: {
          icon: 'md-notifications',
          title: '工单详情',
        },
        component: () => import('@/view/module/workOrder/query/orderDetail.vue'),
      },
      // 合规备案
      {
        path: '/productFiling/detail',
        name: 'productFilingDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/productFiling/detail.vue'),
      },
      // EPR注册工单
      {
        path: '/EPRManage/detail',
        name: 'EPRManageDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/EPRManage/detail.vue'),
      },
      // EPR续费工单
      {
        path: '/eprRenew/detail',
        name: 'eprRenewDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/eprRenew/detail.vue'),
      },
      // EPR转代理工单
      {
        path: '/EPRTaxServices/detail',
        name: 'EPRTaxServicesDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/EPRTaxServices/detail.vue'),
      },
      // 加类加品牌
      {
        path: '/addCategoryBrand/detail',
        name: 'AddCategoryBrandDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/addCategoryBrand/detail.vue'),
      },
      // EPR注册工单
      {
        path: '/EPRDeclare/detail',
        name: 'EPRDeclareDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/EPRDeclare/detail.vue'),
      },
      // 预申报
      {
        path: '/preDeclare/detail',
        name: 'PreDeclareDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/preDeclare/detail.vue'),
      },

      // EPR续费
      {
        path: '/EPRRenewal/detail',
        name: 'EPRRenewalDetail',
        meta: {
          icon: 'md-notifications',
          title: '服务详情',
        },
        component: () => import('@/view/module/workOrder/EPRRenewal/detail.vue'),
      },

      // 字段和节点配置
      {
        path: '/workOrder/fieldConfig/editField',
        name: 'editfield',
        meta: {
          icon: 'md-notifications',
          title: '字段配置',
        },
        component: () => import('@/view/module/workOrder/fieldConfig/editField.vue'),
      },
      {
        path: '/workOrder/processConfig/editProcess',
        name: 'editprocess',
        meta: {
          icon: 'md-notifications',
          title: '节点配置',
        },
        component: () => import('@/view/module/workOrder/processConfig/editProcess.vue'),
      },
      {
        path: '/workOrder/downloadConfig/editDownload',
        name: 'editdownload',
        meta: {
          icon: 'md-notifications',
          title: '下载资料配置修改',
        },
        component: () => import('@/view/module/workOrder/downloadConfig/editDownload.vue'),
      },
      {
        path: '/workOrder/downloadConfig/details',
        name: 'dowDetails',
        meta: {
          icon: 'md-notifications',
          title: '下载资料配置详情',
        },
        component: () => import('@/view/module/workOrder/downloadConfig/details.vue'),
      },
      {
        path: '/workOrder/taxConfig/editDownload',
        name: 'edittaxConfig',
        meta: {
          icon: 'md-notifications',
          title: '税确资料配置-新增/更换',
        },
        component: () => import('@/view/module/workOrder/taxConfig/editDownload.vue'),
      },
      {
        path: '/workOrder/taxConfig/details',
        name: 'edDetails',
        meta: {
          icon: 'md-notifications',
          title: '税确资料配置-详情',
        },
        component: () => import('@/view/module/workOrder/taxConfig/details.vue'),
      },
      {
        path: '/workOrder/processConfig/editTemplate',
        name: 'edittemplate',
        meta: {
          icon: 'md-notifications',
          title: '节点字段配置',
        },
        component: () => import('@/view/module/workOrder/processConfig/editTemplate.vue'),
      },
      {
        path: '/workOrder/processConfig/previewTemplate',
        name: 'previewtemplate',
        meta: {
          icon: 'md-notifications',
          title: '查看节点字段',
        },
        component: () => import('@/view/module/workOrder/processConfig/previewTemplate.vue'),
      },
      {
        path: '/workOrder/yearManage/deYearDetail',
        name: 'deYearDetail',
        meta: {
          icon: 'md-notifications',
          title: '年报管理详情',
        },
        component: () => import('@/view/module/workOrder/yearManage/deYearDetail.vue'),
      },
      {
        path: '/workOrder/yearManage/components/annalsDE',
        name: 'annalsDE',
        meta: {
          icon: 'md-notifications',
          title: '提交年报',
        },
        component: () => import('@/view/module/workOrder/yearManage/components/annalsDE.vue'),
      },
      {
        path: '/workOrder/uploadAndDownloadRecords',
        name: 'UploadAndDownloadRecords',
        meta: {
          icon: 'md-notifications',
          title: '上传/下载中心',
        },
        component: () => import('@/view/module/workOrder/uploadAndDownloadRecords/index.vue'),
      },
      {
        path: '/goodsClassification/detail',
        name: 'GoodsClassificationDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/workOrder/typeConfig/goodsClassification/detail.vue'),
      },
      {
        path: '/workOrderType/detail',
        name: 'WorkOrderTypeDetail',
        meta: {
          icon: 'md-notifications',
          title: '详情',
        },
        component: () => import('@/view/module/workOrder/typeConfig/workOrderType/detail.vue'),
      },
    ],
  },
  // 知识产权中心
  {
    path: '/intellectualProperty',
    name: 'intellectualProperty',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/trademark/detail',
        name: '/trademarkDetail',
        meta: {
          icon: 'md-notifications',
          title: '国际商标详情',
        },
        component: () => import('@/view/module/intellectualProperty/trademark/details.vue'),
      },
      {
        path: '/oa/detail',
        name: '/OaDetail',
        meta: {
          icon: 'md-notifications',
          title: 'OA工单详情',
        },
        component: () => import('@/view/module/intellectualProperty/trademark/workerDetail/index.vue'),
      },
      {
        path: '/proofUS/detail',
        name: '/proofUSDetail',
        meta: {
          icon: 'md-notifications',
          title: '美标证据详情',
        },
        component: () => import('@/view/module/intellectualProperty/proofUS/components/detail'),
      },
      {
        path: '/appearancePatent/detail',
        name: '/appearancePatentDetail',
        meta: {
          icon: 'md-notifications',
          title: '外观专利详情',
        },
        component: () => import('@/view/module/intellectualProperty/appearancePatent/detail'),
      },
      {
        path: '/modelingAndDrawing/detail',
        name: '/modelingAndDrawingDetail',
        meta: {
          icon: 'md-notifications',
          title: '建模绘图详情',
        },
        component: () => import('@/view/module/intellectualProperty/modelingAndDrawing/detail'),
      },
      {
        path: '/OAAppearancePatent/detail',
        name: '/OAAppearancePatentDetail',
        meta: {
          icon: 'md-notifications',
          title: 'OA(外观专利)详情',
        },
        component: () => import('@/view/module/intellectualProperty/OAAppearancePatent/detail'),
      },
      {
        path: '/certificate/detail',
        name: '/certificateDetail',
        meta: {
          icon: 'md-notifications',
          title: '授权书详情',
        },
        component: () => import('@/view/module/intellectualProperty/certificate/detail'),
      },
    ],
  },
  {
    path: '/personal',
    name: 'personal',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/personal/index',
        name: '/personal/index',
        meta: {
          icon: 'md-notifications',
          title: '基本信息',
        },
        component: () => import('@/view/module/personal/index.vue'),
      },
    ],
  },
  //商品中心
  {
    path: '/qkgoods',
    name: 'qkgoods',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/qkgoods/supply/details',
        name: 'tagHide/qkgoods/supply/details',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/opportunity/edit',
        name: 'tagHide/qkgoods/opportunity/edit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/opportunity/details',
        name: 'tagHide/qkgoods/opportunity/details',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/edit',
        name: 'tagHide/qkgoods/demand/edit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/details',
        name: 'tagHide/qkgoods/demand/details',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/costReductionEdit',
        name: 'tagHide/qkgoods/demand/costReductionEdit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/developmentEdit',
        name: 'tagHide/qkgoods/demand/developmentEdit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/entryResultsEdit',
        name: 'tagHide/qkgoods/demand/entryResultsEdit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/demand/entryTestsheetEdit',
        name: 'tagHide/qkgoods/demand/entryTestsheetEdit',
        meta: {
          icon: 'md-notifications',
          title: '商品中心二级页面',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSource/add',
        name: 'qkgoods/goodsSource/add',
        meta: {
          icon: 'md-notifications',
          title: '创建商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSource/addGroup',
        name: 'qkgoods/goodsSource/addGroup',
        meta: {
          icon: 'md-notifications',
          title: '创建组合商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSource/edit/:id',
        name: 'qkgoods/goodsSource/edit',
        meta: {
          icon: 'md-notifications',
          title: '编辑商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSource/editGroup/:id',
        name: 'qkgoods/goodsSource/editGroup',
        meta: {
          icon: 'md-notifications',
          title: '编辑组合商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSales/edit/:id',
        name: 'qkgoods/goodsSales/edit',
        meta: {
          icon: 'md-notifications',
          title: '编辑商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSales/editGroup/:id',
        name: 'qkgoods/goodsSales/editGroup',
        meta: {
          icon: 'md-notifications',
          title: '编辑组合商品',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSource/details/:id',
        name: 'qkgoods/goodsSource/details',
        meta: {
          icon: 'md-notifications',
          title: '商品详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/goodsSales/details/:id',
        name: 'qkgoods/goodsSales/details',
        meta: {
          icon: 'md-notifications',
          title: '商品详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/settlementCenter/serviceProviderEdit/:id',
        name: 'qkgoods/settlementCenter/serviceProviderEdit',
        meta: {
          icon: 'md-notifications',
          title: '供应商详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/settlementCenter/receiptListEdit/:id',
        name: 'qkgoods/settlementCenter/receiptListEdit',
        meta: {
          icon: 'md-notifications',
          title: '修改付款单',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/qkgoods/settlementCenter/receiptListDetails/:id',
        name: 'qkgoods/settlementCenter/receiptListDetails',
        meta: {
          icon: 'md-notifications',
          title: '付款单详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
    ],
  },
  //新项目
  {
    path: '/adminNewApp',
    name: 'adminNewApp',
    component: Main,
    meta: {
      notCache: true,
      hideInBread: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/adminNewApp/dataCenter/revenue/salesBonus/saleConfig',
        name: 'dataCenter/salesBonus/saleConfig',
        meta: {
          icon: 'md-notifications',
          title: '销售提成配置',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/dataCenter/revenue/salesBonus/detailedReport',
        name: 'dataCenter/salesBonus/detailedReport',
        meta: {
          icon: 'md-notifications',
          title: '销售提成明细报表',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/customerManage/clueCenter/AddClue',
        name: 'adminNewApp/customerManage/clueCenter/AddClue',
        meta: {
          icon: 'md-notifications',
          title: '线索中心新增',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/customerManage/clueCenter/Details',
        name: 'adminNewApp/customerManage/clueCenter/Details',
        meta: {
          icon: 'md-notifications',
          title: '线索中心详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/customerManage/customerCenter/Details',
        name: 'adminNewApp/customerManage/customerCenter/Details',
        meta: {
          icon: 'md-notifications',
          title: '客户中心详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/workOrder/intellectualProperty/OaExamination/details',
        name: 'adminNewApp/workOrder/intellectualProperty/OaExamination/details',
        meta: {
          icon: 'md-notifications',
          title: 'oa审查意见详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/saasmanage/knowManage/activityList/addActivity',
        name: 'adminNewApp/saasmanage/knowManage/activityList/addActivity',
        meta: {
          icon: 'md-notifications',
          title: '创建活动',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/saasmanage/knowManage/qaList/addQa',
        name: 'adminNewApp/saasmanage/knowManage/qaList/addQa',
        meta: {
          icon: 'md-notifications',
          title: '发布问答',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/saasmanage/knowManage/reportList/addReport',
        name: 'adminNewApp/saasmanage/knowManage/reportList/addReport',
        meta: {
          icon: 'md-notifications',
          title: '发布报告',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/details',
        name: 'adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/details',
        meta: {
          icon: 'md-notifications',
          title: '商标核名报告详情',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/report',
        name: 'adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/report',
        meta: {
          icon: 'md-notifications',
          title: '商标核名报告',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/goodsCenter/costcontrol/historyRecord',
        name: 'adminNewApp/goodsCenter/costcontrol/historyRecord',
        meta: {
          icon: 'md-notifications',
          title: '成本管理',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/workOrder/vatServices/taxRegister/details',
        name: 'adminNewApp/workOrder/vatServices/taxRegister/details',
        meta: {
          icon: 'md-notifications',
          title: '待审核资料-审核',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
      {
        path: '/adminNewApp/dataCenter/revenue/customerRevenue/salesDetail',
        name: 'adminNewApp/dataCenter/revenue/customerRevenue/salesDetail',
        meta: {
          icon: 'md-notifications',
          title: '销售明细',
        },
        component: () => import('@/view/module/qiankun/index.vue'),
      },
    ],
  },
];
