import Layout from '@/layout/index'

export default
{
  path: '/accounts',
  name: 'accounts',
  component: Layout,
  meta: { title: '账户管理' },
  redirect: '/accounts/accounts-list',
  children: [
    {
      path: 'accounts-list',
      name: 'accounts_list',
      meta: { title: '货代商账户列表' },
      component: () => import(/* webpackChunkName: "accounts-list" */ '@/view/accountManage/index')
    },
    {
      path: 'accounts-classification',
      name: 'accounts_classification',
      meta: { title: '货代商账户归类' },
      component: () => import(/* webpackChunkName: "accounts_classification" */ '@/view/accountManage/classification')
    },
    {
      path: 'accounts-sealist',
      name: 'accounts_sealist',
      meta: { title: '海外仓服务商列表' },
      component: () => import(/* webpackChunkName: "accounts_sealist" */ '@/view/accountManage/sealist')
    }
  ]
}

