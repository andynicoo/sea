import Layout from '@/layout/index'

export default
{
  path: '/authManage',
  name: 'role',
  component: Layout,
  meta: { title: '权限管理' },
  redirect: '/authManage/role-allocation',
  children: [
    {
      path: 'role-allocation',
      name: 'role_distribute',
      meta: { title: '后台人员管理' },
      component: () => import(/* webpackChunkName: "roleAllocation" */ '@/view/authManage/index.vue')
    },
    {
      path: 'role-auth',
      name: 'role_setting',
      meta: { title: '后台角色管理' },
      component: () => import(/* webpackChunkName: "roleAuth" */ '@/view/authManage/RoleManage')
    }
  ]
}

