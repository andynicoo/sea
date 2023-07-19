import Layout from '@/layout/index'
import RouteChildren from '@/components/routerChildren'

export default
{
  path: '/content',
  name: 'content',
  component: Layout,
  meta: { title: 'ERP内容管理' },
  redirect: '/content/content-list',
  children: [
    {
      path: 'content-list',
      name: 'content_list',
      meta: { title: 'Q&A' },
      component: () => import(/* webpackChunkName: "contentList" */ '@/view/content/index')
    },
    {
      path: 'feedback',
      name: 'content_feedback',
      meta: { title: '意见反馈' },
      component: () => import(/* webpackChunkName: "feedback" */ '@/view/content/Feedback')
    },
    {
      path: 'apply-store',
      name: 'content_apply_store',
      meta: { title: '一键开店' },
      component: () => import(/* webpackChunkName: "applyStore" */ '@/view/content/ApplyStore')
    },
    {
      path: 'fail-reason',
      name: 'content_fail_reason',
      meta: { title: '失败原因' },
      component: () => import(/* webpackChunkName: "failReason" */ '@/view/content/FailReason')
    },
    {
      path: 'use-direction',
      name: 'content_use_direction',
      meta: { title: '使用教程' },
      component: () => import(/* webpackChunkName: "useDirection" */ '@/view/content/UseDirection')
    },
    {
      path: 'news-products',
      name: 'content_news_products',
      meta: { title: 'shopee动态' },
      component: () => import(/* webpackChunkName: "newsProducts" */ '@/view/content/NewsProducts')
    },
    {
      path: 'erp-message',
      name: 'erp-msg',
      redirect: 'erp-message/index',
      meta: { title: '站内信列表', auth: true },
      component: RouteChildren,
      children: [
        {
          path: 'index',
          name: 'erp_message',
          meta: { title: '站内信列表', breadcrumb: false },
          component: () => import(/* webpackChunkName: "erp_message" */ '@/view/content/erpMessage/index')
        },
        {
          path: 'edit/:id?',
          name: 'erp_message_edit',
          meta: { title: '编辑站内信', pathName: 'erp_message' },
          component: () => import(/* webpackChunkName: "erp_message_edit" */ '@/view/content/erpMessage/Edit')
        }
      ]
    }
  ]
}

