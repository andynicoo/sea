import Layout from '@/layout/index'

export default
{
  path: '/erpManage',
  name: 'erpManage',
  component: Layout,
  meta: { title: '权限管理' },
  redirect: '/erpManage/role-allocation',
  children: [
    {
      path: 'menu-manage',
      name: 'menu_manage',
      meta: { title: '后台菜单管理' },
      component: () => import(/* webpackChunkName: "menu_manage" */ '@/view/authManage/menuManage')
    },
    {
      path: 'erp-role-manage',
      name: 'erp_role_manage',
      meta: { title: 'ERP角色管理' },
      component: () => import(/* webpackChunkName: "erp_role_manage" */ '@/view/authManage/ErpRole')
    },
    {
      path: 'erp-menu-manage',
      name: 'erp_menu_manage',
      meta: { title: 'ERP菜单管理' },
      component: () => import(/* webpackChunkName: "erp_menu_manage" */ '@/view/authManage/ErpMenu')
    }
  ]
}

