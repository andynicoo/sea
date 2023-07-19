import Layout from '@/layout/index'

export default
{
  path: '/forwarder',
  name: 'forwarder',
  component: Layout,
  meta: { title: '统计分析' },
  redirect: '/forwarder/statis-list',
  children: [
    {
      path: 'statis-list',
      name: 'statis_all',
      meta: { title: '货代商综合统计' },
      component: () => import(/* webpackChunkName: "takeAccount" */ '@/view/forwarder/StatisList')
    }
  ]
}

