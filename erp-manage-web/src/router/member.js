import Layout from '@/layout/index'

export default
{
  path: '/membermanage',
  name: 'member',
  component: Layout,
  meta: { title: '会员管理' },
  redirect: '/membermanage/index',
  children: [
    {
      path: 'index',
      name: 'member_index',
      meta: { title: '会员套餐管理' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/membermanage/index')
    },
    {
      path: 'marketing',
      name: 'marketing_index',
      meta: { title: '营销活动' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/membermanage/marketing')
    },
    {
      path: 'promotion',
      name: 'promotion_index',
      meta: { title: '营销推广' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/membermanage/promotion')
    }
    // {
    //   path: 'config',
    //   name: 'config_index',
    //   meta: { title: '工具配置' },
    //   component: () => import(/* webpackChunkName: "forwarder" */ '@/view/membermanage/config')
    // }
  ]
}

