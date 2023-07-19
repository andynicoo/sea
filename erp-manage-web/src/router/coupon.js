import Layout from '@/layout/index'

export default
  {
    path: '/coupon',
    name: 'coupon',
    meta: { title: '优惠券管理' },
    component: Layout,
    redirect: '/coupon/list',
    children: [
      {
        path: 'list',
        name: 'coupon_list',
        meta: { title: '优惠券列表' },
        component: () => import(/* webpackChunkName: "coupon_list" */ '@/view/coupon/list')
      },
      {
        path: 'send',
        name: 'coupon_send',
        meta: { title: '赠送优惠券' },
        component: () => import(/* webpackChunkName: "coupon_send" */ '@/view/coupon/send')
      },
      {
        path: 'history',
        name: 'coupon_history',
        meta: { title: '发送记录' },
        component: () => import(/* webpackChunkName: "coupon_history" */ '@/view/coupon/history')
      }
    ]
  }

