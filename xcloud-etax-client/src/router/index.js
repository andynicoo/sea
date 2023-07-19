import Vue from 'vue';
import VueRouter from 'vue-router';

// 避免点击同一个路由报错
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// use vue-router
Vue.use(VueRouter);

// constantRoutes
const constantRoutes = [
  // 单独预渲染打包的路由
  {
    path: '/aboutUs',
    name: '关于我们',
    component: () => import('@/views/common/aboutUs.vue'),
  },
  {
    path: '/notify',
    name: '新手指引',
    component: () => import('@/views/common/notify'),
  },
  {
    path: '/aboutComputed',
    name: '首页税金计算',
    component: () => import('@/views/common/aboutComputed'),
  },
  {
    path: '/en/aboutComputed',
    name: '首页税金计算',
    component: () => import('@/views/common/enAboutComputed'),
  },

  /* 登录 */
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/loginIndex'),
  },
  {
    path: '/en/login',
    name: '英文登录',
    component: () => import('@/views/login/loginEn'),
  },

  // 默认路径
  {
    path: '/',
    redirect: '/work',
  },
  /* 工作台 */
  {
    path: '/work',
    name: '工作台',
    component: () => import('@/views/home/index.vue'),
    // meta: { name:'工作台'}
  },
  // 续费管理
  {
    path: '/renewal',
    name: '续费管理',
    component: () => import('@comp/module/itaxs/renewal/index'),
    // meta: { name:'续费管理'}
  },

  /* 税务管理 */
  // VAT申报
  {
    path: '/filingManagement',
    name: 'VAT申报',
    component: () => import('@/views/home/components/filingManagement'),
    meta: { superior: 'VAT服务', name: 'VAT申报' },
  },
  {
    path: '/filingManagement/computedTax',
    name: 'VAT算税',
    component: () => import('@/views/home/components/fillManagementComputedTax'),
    meta: {
      activePath: '/filingManagement',
    },
  },
  // 英德申报结果页
  {
    path: '/submitConfirm',
    name: '申报结果',
    component: () => import('@/views/home/components/submitConfirm'),
    meta: {
      activePath: '/filingManagement',
    },
  },
  // VAT信件
  {
    path: '/varletters',
    name: 'VAT信件',
    component: () => import('@/views/userManage/setting/vatletters'),
    meta: { superior: 'VAT服务', name: 'VAT信件' },
  },
  // VAT信件
  {
    path: '/myVantService',
    name: 'VAT税号',
    component: () => import('@/views/userManage/setting/service'),
    meta: { superior: 'VAT服务', name: 'VAT税号' },
  },
  // VAT算税
  {
    path: '/computedTax',
    name: 'VAT算税',
    component: () => import('@/views/home/computeTax/index'),
    meta: { superior: 'VAT服务', name: 'VAT算税' },
  },
  // VAT&EORI查询
  {
    path: '/inquireMessage',
    name: 'VAT&EORI查询',
    component: () => import('@/views/home/inquireMessage/index'),
  },
  // 远程销售额监控
  {
    path: '/remoteSales',
    name: '远程销售额监控',
    component: () => import('@/views/home/remoteSales/index'),
  },
  // 增值服务申请
  {
    path: '/addedServices',
    name: '增值服务申请',
    component: () => import('@/views/home/addedServices'),
    meta: { superior: 'VAT服务', name: '增值服务申请' },
  },

  /* VAT服务 */
  {
    path: '/serviceList',
    name: 'vat服务列表',
    component: () => import('@/views/shoppingCart/serviceList'),
  },

  /* 合规业务 */
  // 授权代表工作台
  {
    path: '/complianceBusiness/manageList',
    name: '授权代表工作台',
    component: () => import('@/views/complianceBusiness/manageList'),
    meta: { superior: '产品合规服务', name: '欧代/英代/美代' },
  },
  {
    path: '/complianceBusiness/manageDetails',
    name: '合规业务详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/manageDetails'),
    meta: { superior: '产品合规服务', name: '欧代/英代/美代' },
  },
  {
    path: '/complianceBusiness/filingDetails',
    name: '合规备案详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/filingDetails'),
  },
  {
    path: '/complianceBusiness/productList',
    name: '合规服务',
    component: () => import('@/views/complianceBusiness/productList'),
  },
  // 合规备案
  {
    path: '/complianceBusiness/filingList',
    name: '合规服务',
    component: () => import('@/views/complianceBusiness/filingList'),
    meta: { superior: '产品合规服务', name: '合规备案' },
  },
  // EPR工作台
  {
    path: '/complianceBusiness/EPRList',
    name: 'EPR注册',
    component: () => import('@/views/complianceBusiness/EPRList'),
    meta: { superior: 'EPR服务', name: 'EPR注册' },
  },
  // EPR申报工作台
  {
    path: '/complianceBusiness/EPRDeclareList',
    name: 'EPR申报',
    component: () => import('@/views/complianceBusiness/EPRDeclareList'),
    meta: { superior: 'EPR服务', name: 'EPR申报' },
  },
  // EPR加类加品牌工作台
  {
    path: '/complianceBusiness/addCategoryBrandList',
    name: 'EPR加类加品牌',
    component: () => import('@/views/complianceBusiness/addCategoryBrandList'),
    meta: { superior: 'EPR服务', name: 'EPR加类加品牌' },
  },
  // EPR预申报
  {
    path: '/complianceBusiness/preDeclareList',
    name: 'EPR预申报',
    component: () => import('@/views/complianceBusiness/preDeclareList'),
    meta: { superior: 'EPR服务', name: 'EPR预申报' },
  },
  // EPR续费
  {
    path: '/complianceBusiness/EPRRenewalList',
    name: 'EPR续费',
    component: () => import('@/views/complianceBusiness/EPRRenewalList'),
    meta: { superior: 'EPR服务', name: 'EPR续费' },
  },
  {
    path: '/complianceBusiness/EPRDetails',
    name: 'EPR注册详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/EPRDetails'),
    meta: { superior: 'EPR服务', name: 'EPR注册' },
  },
  {
    path: '/complianceBusiness/EPRDeclareDetails',
    name: 'EPR申报详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/EPRDeclareDetails'),
  },
  {
    path: '/complianceBusiness/addCategoryBrandDetails',
    name: 'EPR加类加品牌详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/addCategoryBrandDetails'),
    meta: { superior: 'EPR服务', name: 'EPR加类加品牌' },
  },
  {
    path: '/complianceBusiness/preDeclareDetails',
    name: 'EPR预申报详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/preDeclareDetails'),
  },
  {
    path: '/complianceBusiness/EPRRenewalDetails',
    name: 'EPR续费详情页',
    component: () => import('@/views/complianceBusiness/complianceRegister/EPRRenewalDetails'),
  },

  /* 店铺管理 */
  {
    path: '/storeManage/storeList',
    name: '店铺列表',
    component: () => import('@/views/storeManage/storeList'),
    meta: { superior: '店铺管理', name: '店铺列表' },
  },
  {
    path: '/storeManage/salesReport',
    name: '销售报告管理',
    component: () => import('@/views/storeManage/salesReport'),
    meta: { superior: '店铺管理', name: '售报告管理' },
  },

  /* 个人中心 */
  // 我的信息
  {
    path: '/user',
    name: '我的信息',
    component: () => import('@/views/userManage/setting/info'),
    meta: { superior: '个人中心', name: '我的信息' },
  },
  // 我的订单
  {
    path: '/orderList',
    name: '我的订单',
    component: () => import('@/views/home/orderManage/orderList'),
    meta: { superior: '个人中心', name: '我的订单' },
  },
  {
    path: '/receiveCoupon',
    name: '领劵中心',
    component: () => import('@/views/home/receiveCoupon/index'),
    meta: { superior: '个人中心', name: '领劵中心' },
  },
  // 优惠券
  {
    path: '/coupon',
    name: '优惠券',
    component: () => import('@/views/userManage/setting/myCoupon'),
    meta: { superior: '个人中心', name: '优惠券' },
  },
  //动态表单
  {
    path: '/registerInfo',
    name: '待上传注册资料',
    component: () => import('@/views/home/registerInfo/newIndex'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  //新版VAT注册+申报提交资料目前包含[德国]
  {
    path: '/registrationInformation',
    name: '待上传注册资料',
    component: () => import('@comp/module/itaxs/vat/registerInfo/index'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  //新版VAT注册+申报查看驳回信息目前包含[德国]
  {
    path: '/registerInfo/rejectInfo',
    name: '查看驳回信息',
    component: () => import('@comp/module/itaxs/vat/registerInfo/rejectInfo'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  //新版VAT注册+申报查看税号信息目前包含[德国]
  {
    path: '/registerInfo/vatNumberInfo',
    name: '税号信息',
    component: () => import('@comp/module/itaxs/vat/registerInfo/vatNumberInfo'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  {
    path: '/myInvite',
    name: '我邀请的用户',
    component: () => import('@/views/userManage/setting/myInvited'),
  },
  {
    path: '/securitySetting',
    name: '安全设置',
    component: () => import('@/views/userManage/setting/securitySetting'),
  },
  {
    path: '/turnToAgent',
    name: '转代理',
    component: () => import('@/views/home/turnToAgent/newIndex'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },

  // 英国退税服务
  {
    path: '/taxRefund',
    name: '退税服务',
    component: () => import('@/views/home/taxRefund/newIndex'),
    meta: {},
  },
  {
    path: '/informationList',
    name: '新闻资讯列表',
    component: () => import('@/views/information/informationList'),
    meta: {
      activePath: '/filingManagement',
    },
  },
  {
    path: '/informationDetail',
    name: '资讯详情',
    component: () => import('@/views/information/informationDetail'),
    meta: {},
  },
  {
    path: '/shoppingCart',
    name: '购物车',
    component: () => import('@/views/shoppingCart/shoppingCart'),
  },
  {
    path: '/serviceDetail',
    name: 'serviceDetail',
    component: () => import('@/views/shoppingCart/serviceDetail'),
  },
  {
    path: '/sureOrder',
    name: '确认订单',
    component: () => import('@/views/shoppingCart/sureOrder/index.vue'),
  },
  {
    path: '/filingData',
    name: '提交英国申报数据',
    component: () => import('@/views/home/filingData/index'),
    meta: {
      activePath: '/filingManagement',
    },
  },
  {
    path: '/sendFileES',
    name: '发送文件（意大利）',
    component: () => import('@/views/home/ESfile/sendFileES'),
  },
  {
    path: '/stationLetter',
    name: '站内信',
    component: () => import('@/views/userManage/stationLetter'),
  },
  {
    path: '/taxDetails',
    name: '报税详情',
    component: () => import('@/views/home/taxModal/taxDetails.vue'),
  },
  {
    path: '/cancelTaxNum',
    name: '注销税号',
    component: () => import('@/views/home/cancelTaxNum/newIndex'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  {
    path: '/annalsDe',
    name: '德国年报',
    component: () => import('@/views/home/computeTax/annalsDe'),
  },
  {
    path: '/taxInspection',
    name: '税务稽查',
    component: () => import('@/views/home/taxInspection/newIndex'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  {
    path: '/declareSuccess',
    name: '申报成功',
    component: () => import('@/views/home/computeTax/declareSuccess'),
  },
  {
    path: '/taxFinishSuccess',
    name: '申报成功',
    component: () => import('@/views/home/computeTax/taxFinishSuccess'),
  },
  {
    path: '/authorizedRegistration',
    name: '授权注册税号',
    component: () => import('@/views/home/authorizedTaxRegistration/index'),
  },
  {
    path: '/taxProblems',
    name: '税务问题',
    component: () => import('@/views/home/taxProblems/index'),
  },
  {
    path: '/serviceUnused',
    name: '服务未使用',
    component: () => import('@/views/home/serviceUnused/index'),
  },
  {
    path: '/paySuccess',
    name: '购买成功',
    component: () => import('@/views/shoppingCart/paySuccess'),
  },
  {
    path: '/paySuccess',
    name: '购买成功',
    component: () => import('@/views/shoppingCart/paySuccess'),
  },
  {
    path: '/submitSuccess',
    name: '提交资料成功',
    component: () => import('@/views/home/submitSuccess/index'),
  },

  {
    path: '/remoteSalesDetail',
    name: '远程销售详情',
    component: () => import('@/views/home/remoteSales/detail'),
  },
  {
    path: '/customerManager',
    name: '客户经理',
    component: () => import('@/views/userManage/customerManager'),
  },

  {
    path: '/hagueInformation',
    name: '海牙认证完善信息',
    component: () => import('@/views/home/hagueInformation/index'),
    meta: { superior: 'VAT服务', name: 'VAT注册' },
  },
  {
    path: '/annalsDeList',
    name: '德国年报列表',
    component: () => import('@/views/home/computeTax/annalsDeList'),
    meta: { superior: 'VAT服务', name: '年报管理' },
  },
  {
    path: '/activity',
    name: '活动',
    component: () => import('@/views/activity/index'),
  },
  {
    path: '/activity/crazyThursday',
    name: '疯狂星期四',
    component: () => import('@/views/activity/crazyThursday/index'),
  },
  {
    path: '/activity/sevenYears',
    name: '七周年',
    component: () => import('@/views/activity/sevenYears/index'),
  },
  {
    path: '/activity618',
    name: '活动618',
    component: () => import('@/views/activity618/index'),
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../../xcloud-client-components-web/payment/index'),
  },
  {
    path: '/paymentSuccess',
    name: 'PaymentSuccess',
    component: () => import('../../xcloud-client-components-web/payment/paymentSuccess'),
  },
  {
    path: '/paymentReject',
    name: 'PaymentReject',
    component: () => import('../../xcloud-client-components-web/payment/paymentReject'),
  },
  {
    path: '/paymentFail',
    name: 'PaymentFail',
    component: () => import('../../xcloud-client-components-web/payment/paymentFail'),
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
  {
    path: '/otherService',
    name: '其他服务',
    component: () => import('@/views/home/otherService/otherServiceList'),
    meta: { superior: '个人中心', name: '其他服务' },
  },
  {
    path: '/otherServicesDetail',
    name: '其他服务详情',
    component: () => import('@/views/home/otherService/otherServicesDetail'),
  },
  {
    path: '/integralMal',
    name: '我的积分',
    component: () => import('@/views/integralMal'),
    meta: { superior: '个人中心', name: '我的积分' },
  },
  {
    path: '/address',
    name: '收货地址',
    component: () => import('@/views/address'),
  },
  {
    path: '/address/edit',
    name: '修改收货地址',
    component: () => import('@/views/address/edit'),
  },
  {
    path: '/paymentSucceeded',
    name: '支付成功',
    component: () => import('@/views/home/components/paymentSucceeded'),
  },
  {
    path: '/submittedSucceeded',
    name: '提交成功',
    component: () => import('@/views/home/components/submittedSucceeded'),
  },
];

const router = new VueRouter({
  mode: 'history', // hash or history
  base: '/client/', // 路径访问加前缀的时候需要配置，需和vue.config.js中publicPath配置一样
  routes: constantRoutes,
});

// reset router
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
  // 防止退出后再登录，再次加载权限菜单会有重复的路由
  router.options.routes = constantRoutes;
}
export default router;
