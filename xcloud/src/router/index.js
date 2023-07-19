import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import iView from 'view-design';
import { setToken, getToken, canTurnTo, formatRouters } from '@/libs/util';
import config from '@/config';
import { setUserinfo } from '../view/module/customer/billManage/util/billUtils';

const { homeName } = config;
Vue.use(Router);
// 存放加载的动态路由
let dyncRouters = [];

let BASE_URL = '/';
// switch (process.env.NODE_ENV) {
//   case "development":
//     BASE_URL = config.publicPath.dev; // 这里是本地的请求url
//     break;
//   case "production":
//     BASE_URL = config.publicPath.pro; // 生产环境url
//     break;
// }

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new Router({
  base: BASE_URL,
  routes: routes,
  mode: 'history',
});
const LOGIN_PAGE_NAME = 'login';

const permitList = [LOGIN_PAGE_NAME, 'loginSuccess'];

const turnTo = (to, access, next) => {
  if (!to.name) {
    // 防止地址栏刷新动态路由跳转到401或404,先跳转到homeName
    router.replace(to);
  } else if (canTurnTo(to.name, access, routes)) {
    next();
  } else {
    // 无权限，重定向到401页面
    next({ replace: true, name: 'error_401' });
  }
};

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (!token && !permitList.includes(to.name)) {
    // 未登录,并且不是白名单
    next({
      name: LOGIN_PAGE_NAME, // 跳转到登录页
    });
  } else if (!token && permitList.includes(to.name)) {
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName, // 跳转到homeName页
    });
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next);
    } else {
      if (localStorage.getItem('userInfo') && localStorage.getItem('menuList')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const menuList = JSON.parse(localStorage.getItem('menuList'));
        setUserInfo(userInfo);
        setMenu(menuList);
        if (!dyncRouters || dyncRouters.length === 0) {
          dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access));
          // 防止重复添加路由报错
          router.addRoutes(dyncRouters);
          routes.push(...dyncRouters);
        }
        turnTo(to, store.state.user.access, next);
      } else {
        store
          .dispatch('getUserInfo')
          .then((res) => {
            if (!dyncRouters || dyncRouters.length === 0) {
              dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access));
              // 防止重复添加路由报错
              router.addRoutes(dyncRouters);
              routes.push(...dyncRouters);
            }
            turnTo(to, store.state.user.access, next);
          })
          .catch(() => {
            setToken('');
            next({
              name: 'login',
            });
          });
      }
    }
  }
});

router.afterEach((to) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

//设置用户信息
function setUserInfo(userInfo) {
  const commit = store.commit;
  const res = {
    data: userInfo,
  };
  commit('setAvatar', res.data.avatar);
  commit('setUserName', res.data.username);
  commit('setNickName', res.data.nickName);
  commit('setUserId', res.data.userId);
  commit('setEmail', res.data.email);
  commit('setMobile', res.data.mobile);
  commit('setUserDesc', res.data.userDesc);
  commit('setRoles', res.data.roles);
  const access = [];
  if (res.data.authorities) {
    res.data.authorities.map((item) => {
      if (item.authority) {
        access.push(item.authority);
      }
    });
  }
  // 转换权限
  commit('setAccess', access);
  commit('setHasGetInfo', true);
}

//设置菜单
function setMenu(menuList) {
  const commit = store.commit;
  const res = {
    data: menuList,
  };
  let list = res.data;
  list.map((item) => {
    if (item.path == 'customer/customerInfo/index') {
      localStorage.setItem('userInfoMenuid', item.menuId);
    }
  });
  commit('setUserMenus', res.data);
}

export default router;
