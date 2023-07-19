import router from './router';
import store from './store';
import defaultSettings from './settings';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
// 引入白名单的数据，在白名单中的路由不会被登录拦截
import nProgress from 'nprogress';

// 路由白名单，在白名单中的路由可以直接打开新页面，不显示sidebar和navbar
const whiteList = [
  '/login',
  '/en/login',
  '/activityPage',
  '/activity618',
  '/aboutComputed',
  '/taxRegister',
  '/prizePage',
  '/activity',
  '/lottery',
  '/payment',
  '/paymentSuccess',
  '/paymentFail',
  '/paymentReject',
  '/activity/crazyThursday',
  '/activity/sevenYears',
];

// 白名单中某些特殊页面需要展示顶部的navbar，同时配置以下该属性，比如一些活动页面
const onlyNavbarList = [
  '/lottery',
  '/activity',
  '/activityPage',
  '/activity618',
  '/paymentFail',
  '/activity/crazyThursday',
  '/activity/sevenYears',
  '/aboutComputed',
  '/prizePage',
];
const exitCustomerList = ['/paymentSuccess', '/payment'];

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 路由前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  // document.title = getPageTitle(to.meta.title);

  // 获取登录的token
  const hasToken = store.getters.token;
  if (hasToken) {
    if (to.path.includes('/login')) {
      next({ path: '/work' });
      nProgress.done();
    } else {
      // next
      next();
    }
  }
  // 没有登录token
  else {
    let toPath = to.path;
    toPath = toPath.replace(/\/$/g, '');
    // 在白名单中，继续路由跳转
    if (whiteList.includes(toPath)) {
      next();
    } else {
      // 不在白名单，跳转到login
      next('/login');
      NProgress.done();
    }
  }
});

// 导航后置守卫
router.afterEach((to, from) => {
  NProgress.done();
});

export { whiteList, onlyNavbarList, exitCustomerList };
