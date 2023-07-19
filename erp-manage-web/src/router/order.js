import Layout from '@/layout/index'

export default
{
  path: '/ordermanage',
  name: 'order',
  component: Layout,
  meta: { title: '订单列表' },
  redirect: '/ordermanage/index',
  children: [
    {
      path: 'index',
      name: 'order_index',
      meta: { title: '订单列表' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/orderManage/index')
    },
    {
      path: 'packageList',
      name: 'order_packageList',
      meta: { title: '代打包订单列表' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/orderManage/packageList')
    }
  ]
}

