import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';
import home from '@/views/login/loginIndex';
import Cookies from 'js-cookie';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/client/',
  routes: [
    {
      path: '/',
      name: '首页',
      component: home,
      meta: { breadNumber: 0 },
    },
    {
      path: '/work',
      name: '工作台',
      component: () => import('@/views/work/index'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/userManage/setting/information'),
    },
    {
      path: '/receiveCoupon',
      name: '领劵中心',
      component: () => import('@/views/userManage/setting/receiveCoupon'),
    },
    {
      path: '/coupon',
      name: '我的优惠券',
      component: () => import('@/views/userManage/setting/myCoupon'),
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
      path: '/monitor',
      name: '跟卖监控管理',
      component: () => import('@/views/userManage/setting/monitor'),
    },
    {
      path: '/shoppingCart',
      name: '购物车',
      component: () => import('@/views/shoppingCart/shoppingCart'),
    },
    {
      path: '/sureOrder',
      name: '确认订单',
      component: () => import('@/views/shoppingCart/sureOrder/index.vue'),
    },
    {
      path: '/oaPaid',
      name: '确认订单',
      component: () => import('@/views/shoppingCart/sureOrder/oaPaid.vue'),
    },
    // {
    //   path: "/oaSureOrder",
    //   name: "确认oa订单",
    //   component: () => import("@/views/shoppingCart/oaSureOrder"),
    // },
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
    {
      path: '/productDetail',
      name: '商品详情',
      component: () => import('@/views/productInfo/productDetail'),
    },
    {
      path: '/infoDetail',
      name: '商标详情',
      component: () => import('@/views/myBrand/breadInfoDetail'),
    },
    {
      path: '/fillEvidence',
      name: '使用证据',
      component: () => import('@/views/myBrand/fillEvidence'),
    },
    {
      path: '/adjustCate',
      name: 'AdjustCate',
      component: () => import('@/views/myBrand/adjustCate'),
    },
    {
      path: '/useEvidence',
      name: 'UseEvidence',
      component: () => import('@/views/myBrand/useEvidence'),
    },
    {
      path: '/myOrder',
      name: '我的订单',
      component: () => import('@/views/userManage/setting/myOrder'),
    },
    {
      path: '/myPatent',
      name: '我的专利',
      component: () => import('@/views/myPatent/index'),
    },
    {
      path: '/myPatent/detail/:id',
      name: '专利详情',
      component: () => import('@/views/myPatent/detail'),
    },
    {
      path: '/myPatent/fillInfomation/:id',
      name: '填写资料',
      component: () => import('@/views/myPatent/fillInfomation'),
    },
    {
      path: '/myPatent/succeed/:serviceId',
      name: '资料提交成功',
      component: () => import('@/views/myPatent/succeed'),
    },
    {
      path: '/myBrand',
      name: '我的商标',
      component: () => import('@/views/myBrand/myBrand'),
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
    // {
    //   path: '/activity',
    //   name: '315活动',
    //   component: () => import('@/views/activity/315/index')
    // },
    {
      path: '/activity618',
      name: '618秒杀',
      component: () => import('@/views/activity/618/index'),
    },
    {
      path: '/activity',
      name: '活动页面',
      component: () => import('@/views/activity'),
    },
    // {
    //   path: '/prizePage',
    //   name: '618刮奖',
    //   component: () => import('@/views/activity/618/prizePage')
    // },
    {
      path: '/lottery',
      name: '抽奖活动',
      component: () => import('@/views/activity/lottery'),
    },
    /* 商标核名 */
    {
      path: '/trademarkName',
      name: '商标核名',
      component: () => import('@/views/trademarkName/trademarkName'),
    },
    /* 商标监测 */
    {
      path: '/trademarkMonitoring',
      name: '商标监测',
      component: () => import('@/views/trademarkMonitoring/trademarkMonitoring'),
    },
    /* 我的收藏 商标 */
    {
      path: '/trademarkCollect',
      name: '我的收藏',
      component: () => import('@/views/trademarkCollect/trademarkCollect'),
    },
    /* 积分商城 */
    {
      path: '/integralMal',
      name: '积分商城',
      component: () => import('@/views/integralMal'),
    },
    /* 地址管理 */
    {
      path: '/address',
      name: '地址管理',
      component: () => import('@/views/address'),
    },
    {
      path: '/address/edit',
      name: '地址编辑',
      component: () => import('@/views/address/edit'),
    },
    {
      path: '/paymentSucceeded',
      name: '支付成功',
      component: () => import('@/views/common/paymentSucceeded'),
    },
    {
      path: '/submittedSucceeded',
      name: '提交成功',
      component: () => import('@/views/common/submittedSucceeded'),
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
      path: '/paymentFail',
      name: 'PaymentFail',
      component: () => import('../../xcloud-client-components-web/payment/paymentFail'),
    },
    {
      path: '/trademarkNameReviewReport',
      name: 'TrademarkNameReviewReport',
      component: () => import('../../xcloud-client-components-web/trademarkNameReviewReport/index'),
    },
  ],
});
router.beforeEach((to, from, next) => {
  // 单点登录，检查到 crossSessionId，自动退出，带crossSessionId到login页面重新登录
  let query = to.query;
  let isLoginPage = to.path === '/' || to.path === '/login' || to.path === '/en/login';
  // && !isLoginPage
  if (query.crossSessionId) {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');

    Cookies.remove('token');
    Cookies.remove('sessionId');
    // window.location.href = '/login?crossSessionId='+ query.crossSessionId;
    // window.location.reload()
  }
  console.log('tooooo', to);
  if (
    to.path === '/' ||
    to.path === '/login' ||
    to.path === '/en/login' ||
    to.path === '/productDetail' ||
    to.path === '/sureOrder' ||
    to.path === '/shoppingCart' ||
    to.path === '/activity' ||
    to.path === '/activity618' ||
    to.path === '/prizePage' ||
    to.path === '/payment' ||
    to.path === '/paymentSuccess' ||
    to.path === '/trademarkNameReviewReport' ||
    to.path === '/oaPaid'
  ) {
    store.commit('saveLeft', false);
    next();
  } else {
    store.commit('saveLeft', true);
    next();
  }
});
export default router;
