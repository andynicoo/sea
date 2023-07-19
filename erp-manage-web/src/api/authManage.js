import http from '@/utils/request'
/** 获取菜单
 * @param accSysCode{String} mg:表示运营后台的菜单
 */
function getMenuList(data) {
  return http({
    url: '/mg/member/menu/all/list',
    method: 'get',
    data
  })
}
// 获取会员(成员)列表
function roleUserList(data) {
  return http({
    url: '/mg/mg/mg-account/list',
    method: 'post',
    // showLoading: false,
    data
  })
}
// 角色列表
function roleList(data) {
  return http({
    url: '/mg/manager-role/list',
    data
  })
}
// 删除角色
function deleteRole(id) {
  return http({
    url: `/mg/manager-role/${id}`,
    method: 'delete'
  })
}
// 编辑角色(重命名)
function roleEdit(data) {
  return http({
    url: `/mg/manager-role/detail/edit`,
    method: 'post',
    data
  })
}
// 添加成员
function userAdd(data) {
  return http({
    url: `/mg/mg/mg-account/add`,
    method: 'post',
    data
  })
}
// 修改成员信息
function userEdit(data) {
  return http({
    url: `/mg/mg/mg-account/edit`,
    method: 'post',
    data
  })
}
// 添加角色
function roleAdd(data) {
  return http({
    url: `/mg/manager-role/add`,
    method: 'post',
    data
  })
}
// 删除成员(账号)
function userDelete(data) {
  return http({
    url: `/mg/mg/mg-account/delete`,
    method: 'delete',
    data
  })
}
// 获取角色菜单权限
function getRoleAuth(roleId) {
  return http({
    url: `/mg/manager-role/detail/list/${roleId}`
  })
}
// 获取内测用户
function getAlphaAccount(data) {
  return http({
    url: `/mg/mg/member/getAlphaAccount`,
    method: 'get',
    data
  })
}
// 删除内测用户
function deleteAlphaAccount(data) {
  return http({
    url: `/mg/mg/member/deleteAlphaAccount`,
    method: 'delete',
    data
  })
}
// 新增内测用户
function addAlphaAccount(data) {
  return http({
    url: `/mg/mg/member/addAlphaAccount`,
    method: 'post',
    data
  })
}
// 获取内测用户角色
function getAlphaAccountRole(data) {
  return http({
    url: `/mg/manager-role/getAlphaAccountRole`,
    data
  })
}
// 获取erp角色权限
function getErpRoleAuth(roleId) {
  return http({
    url: `/mg/manager-role/erp/detail/list/${roleId}`
  })
}
// 添加内测用户的菜单
function addAlphaAccountMenu(data) {
  return http({
    url: `/mg/member/menu/add`,
    method: 'post',
    data
  })
}
// 编辑内测用户的菜单
function editAlphaAccountMenu(data) {
  return http({
    url: `/mg/member/menu/edit`,
    method: 'post',
    data
  })
}
// 删除ERP菜单
function deleteMenu(data) {
  return http({
    url: `/mg/member/menu/delete`,
    method: 'post',
    data
  })
}
// erp角色列表
function erpRoleList(data) {
  return http({
    url: `/mg/manager-role/erp/page`,
    method: 'get',
    data
  })
}
// 编辑ERP角色
function erpRoleAuthEdit(data) {
  return http({
    url: `/mg/manager-role/erp/edit`,
    method: 'post',
    data
  })
}
// 新增ERP角色
function erpRoleAuthAdd(data) {
  return http({
    url: `/mg/manager-role/erp/add`,
    method: 'post',
    data
  })
}
// 删除ERP角色
function erpRoleAuthDelete(id) {
  return http({
    url: `/mg/manager-role/erp/${id}`,
    method: 'delete'
  })
}

export {
  getMenuList,
  roleList,
  deleteRole,
  roleUserList,
  userAdd,
  roleAdd,
  userEdit,
  userDelete,
  getRoleAuth,
  roleEdit,
  getAlphaAccount,
  deleteAlphaAccount,
  addAlphaAccount,
  getAlphaAccountRole,
  getErpRoleAuth,
  addAlphaAccountMenu,
  editAlphaAccountMenu,
  deleteMenu,
  erpRoleList,
  erpRoleAuthEdit,
  erpRoleAuthAdd,
  erpRoleAuthDelete
}
