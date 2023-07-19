import Layout from '@/layout/index'

export default
{
  path: '/usermanage',
  name: 'user',
  component: Layout,
  meta: { title: '用户管理' },
  redirect: '/usermanage/all-user',
  children: [
    {
      path: 'all-user',
      name: 'user_all',
      meta: { title: '全部用户' },
      component: () => import(/* webpackChunkName: "all-user" */ '@/view/usermanage/AllUser')
    },
    {
      path: 'shop-list',
      name: 'user_shop',
      meta: { title: '店铺列表' },
      component: () => import(/* webpackChunkName: "shop-list" */ '@/view/usermanage/ShopList')
    },
    {
      path: 'relationship',
      name: 'user_relationship',
      meta: { title: '邀请关系列表' },
      component: () => import(/* webpackChunkName: "relationship" */ '@/view/usermanage/Relationship')
    },
    {
      path: 'forwarder',
      name: 'user_forwarder',
      meta: { title: '货代商列表' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/usermanage/Forwarder')
    },
    {
      path: 'supplier',
      name: 'user_supplier',
      meta: { title: '供应商管理' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/usermanage/Supplier')
    }
  ]
}

