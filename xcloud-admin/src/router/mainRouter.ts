import type { RouteRecordRaw } from 'vue-router';
import routes from '~pages';

const mainRouter: RouteRecordRaw = {
  path: '/homewrap',
  meta: { title: '主体' },
  component: () => import('@/components/layouts/Home.vue'),
  children: routes,
};

export { mainRouter };
