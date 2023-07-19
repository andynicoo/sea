import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const subscribe: AppRouteModule = {
  path: '/subscribe',
  name: 'Subscribe',
  component: LAYOUT,
  redirect: '/subscribe/mine',
  meta: {
    orderNo: 9,
    icon: 'ion:grid-outline',
    title: t('routes.subscribe.subscribe'),
  },
  children: [
    {
      path: 'mine',
      name: 'Mine',
      component: () => import('/@/views/subscribe/mine.vue'),
      meta: {
        title: t('routes.subscribe.mine'),
      },
    },
    {
      path: 'detail/:id',
      name: 'Detail',
      component: () => import('/@/views/subscribe/detail.vue'),
      meta: {
        hideMenu: true,
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/subscribe/mine',
        title: t('routes.subscribe.detail'),
      },
    },
  ],
};

export default subscribe;
