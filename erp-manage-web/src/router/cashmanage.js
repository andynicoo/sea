import Layout from '@/layout/index'

export default
{
  path: '/cashmanage',
  name: 'cash',
  component: Layout,
  meta: { title: '旺币管理' },
  redirect: '/cashmanage/cash-record',
  children: [
    {
      path: 'cash-record',
      name: 'cash_record',
      meta: { title: '旺币记录' },
      component: () => import(/* webpackChunkName: "cashRecord" */ '@/view/cashmanage/index')
    },
    {
      path: 'cash-distribution',
      name: 'cash_distribution',
      meta: { title: '旺币分配' },
      component: () => import(/* webpackChunkName: "cashRecord" */ '@/view/cashmanage/Distribution')
    },
    {
      path: 'task-setting',
      name: 'cash_setting',
      meta: { title: '任务设置' },
      component: () => import(/* webpackChunkName: "taskSetting" */ '@/view/cashmanage/TaskSetting')
    }
  ]
}

