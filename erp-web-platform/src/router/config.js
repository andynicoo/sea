import { LayoutAuth, LayoutPublic } from '@/components/layouts'

export const publicRoute = [
  {
    path: '*',
    component: () => import('@/views/error/NotFound.vue')
  },
  {
    path: '/oauth',
    component: LayoutAuth,
    redirect: '/oauth/authorize',
    hidden: true,
    children: [
      {
        path: 'authorize',
        name: 'authorize',
        component: () => import('@/views/auth/Authorize')
      }
    ]
  },
  {
    path: '/auth',
    component: LayoutAuth,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'register',

        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'find-password',
        name: 'findPassword',

        component: () => import('@/views/auth/FindPassword.vue')
      }
    ]
  },
  {
    path: '/public',
    component: LayoutPublic,
    children: [
      {
        path: '/public/agreement',
        name: 'agreement',
        component: () => import('@/views/auth/Agreement.vue')
      },

      {
        path: '/public/privacy',
        name: 'privacy',
        component: () => import('@/views/auth/Privacy.vue')
      }
    ]
  },
  {
    path: '/meituxiuxiu',
    name: 'meituxiuxiu',
    component: () => import('@/views/Meituxiuxiu.vue')
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/NotFound.vue')
  },

  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/Deny.vue')
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/Error.vue')
  },

  {
    path: '/oms/store', //授权店铺
    component: () => import('@/views/Store.vue')
  },
  {
    path: '/oms/order/first-kilometer-forecast', //发货预报
    component: () => import('@/views/order/FirstKilometerForecast.vue')
  },
  {
    path: '/oms/order/first-kilometer-forecast-interior', //已发货预报
    component: () => import('@/views/order/FirstKilometerForecastInterior.vue')
  },
  {
    path: '/oms/order/after-sale-details', //查看退款/退货详情
    component: () => import('@/views/order/AfterSaleDetails.vue')
  },
  {
    path: '/oms/order/split-order', //拆分订单页面
    component: () => import('@/views/order/SplitOrder.vue')
  },
  {
    path: '/oms/order/page-unpackaged', //未代打包页面
    component: () => import('@/views/order/PageUnpackaged.vue')
  }
]
