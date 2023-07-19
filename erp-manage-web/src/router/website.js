import Layout from '@/layout/index'
import RouterChildren from '@/components/routerChildren'

export default
{
  path: '/website',
  name: 'website',
  component: Layout,
  meta: { title: '官网内容管理' },
  redirect: '/website/news',
  children: [
    {
      path: 'news',
      name: 'news',
      meta: { title: '新闻动态管理' },
      redirect: '/website/news/index',
      component: RouterChildren,
      children: [
        {
          path: 'index',
          name: 'news_manager',
          meta: { title: '列表', breadcrumb: false },
          component: () => import(/* webpackChunkName:"news-index" */ '@/view/website/news/index')
        },
        {
          path: 'edit/:id?',
          name: 'news_manager_edit',
          meta: { title: '发布', pathName: 'news_manager' },
          component: () => import(/* webpackChunkName:"editNews" */ '@/view/website/news/EditNews')
        }
      ]
    },
    {
      path: 'using-help',
      name: 'using_help',
      meta: { title: '使用帮助管理' },
      redirect: 'using-help/index',
      component: RouterChildren,
      children: [
        {
          path: 'index',
          name: 'using_help_manager',
          meta: { title: '使用帮助管理', breadcrumb: false },
          component: () => import(/* webpackChunkName: "using-help" */ '@/view/website/usingHelp')
        },
        {
          path: 'edit/:id?',
          name: 'using_help_manager_edit',
          meta: { title: '教程', pathName: 'using_help_manager' },
          component: () => import(/* webpackChunkName: "using_help_manager_edit" */ '@/view/website/usingHelp/edit')
        }
      ]
    },
    {
      path: 'case',
      name: 'case',
      meta: { title: '案例管理' },
      redirect: 'case/index',
      component: RouterChildren,
      children: [
        {
          path: 'index',
          name: 'case_manager',
          meta: { title: '', breadcrumb: false },
          component: () => import(/* webpackChunkName: "case_manager" */ '@/view/website/case')
        },
        {
          path: 'edit/:id?',
          name: 'case_manager_edit',
          meta: { title: '案例编辑/新增', pathName: 'case_manager' },
          component: () => import(/* webpackChunkName: "case_manager_edit" */ '@/view/website/case/edit')
        }
      ]
    },
    {
      path: 'advertising',
      name: 'advertising',
      meta: { title: '广告管理' },
      component: () => import(/* webpackChunkName: "forwarder" */ '@/view/website/advertising')
    }
  ]
}

