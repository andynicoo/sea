import Layout from '@/layout/index'

export default
{
  path: '/account',
  name: 'account',
  component: Layout,
  meta: { title: '账务管理' },
  redirect: '/account/take-account',
  children: [
    {
      path: 'take-account',
      name: 'account_take_account',
      meta: { title: '提现审批' },
      component: () => import(/* webpackChunkName: "takeAccount" */ '@/view/account/index')
    }
  ]
}

