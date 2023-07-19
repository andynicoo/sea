import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { mainRouter } from './mainRouter';
import { useStore } from '@/stores/store';
import { message } from 'ant-design-vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/error/Page404.vue'),
  },
  mainRouter,
];

(mainRouter as any).children.forEach((ele: any) => {
  routes.push({
    name: 'adminNewApp-' + ele.name,
    path: '/adminNewApp' + ele.path,
    meta: ele.meta,
    component: ele.component,
  });
});

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && to.path !== '/login') {
    if (useStore().getToken) {
      next();
    } else {
      message.error('请登录后访问！');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
