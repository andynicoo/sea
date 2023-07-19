import Layout from '@/layout/index'

export default
{
  path: '/paymanage',
  name: 'pay_manage',
  component: Layout,
  meta: { title: '支付管理' },
  redirect: '/paymanage/config-list',
  children: [
    {
      path: 'config-list',
      name: 'pay_manage_config',
      meta: { title: '支付配置' },
      component: () => import(/* webpackChunkName: "accounts-list" */ '@/view/paymanage/index')
    },
    {
      path: 'recharge-list',
      name: 'pay_manage_recharge',
      meta: { title: '充值订单列表' },
      component: () => import(/* webpackChunkName: "accounts-list" */ '@/view/paymanage/rechargelist')
    }
  ]
}

