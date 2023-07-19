import http from '@/utils/request'
// 获取店铺列表
function getShopList(params) {
  return http({
    url: '/mg/mgstore/info/page',
    params
  })
}
// 编辑店铺
function editShop(data) {
  return http({
    url: '/mg/mgstore/info/edit',
    method: 'post',
    data
  })
}
// 导出店铺
function exportShop(data) {
  return http({
    url: '/mg/mgstore/info/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 邀请列表
function getInvitationList(params) {
  return http({
    url: '/mg/mgmember/info/invitation/list',
    method: 'get',
    params
  })
}
// 邀请人员导出
function exportInvitation(data) {
  return http({
    url: `/mg/mgmember/info/invitation/export`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 邀请关系列表
function invitationRelation(params) {
  return http({
    url: `/mg/mgmember/info/invitationRalation/list`,
    method: 'get',
    params
  })
}
// 用户列表
function getUserList(data) {
  return http({
    url: `/mg/mgmember/info/member/list`,
    method: 'post',
    data
  })
}
// 修改用户信息
function putUserInfo(data) {
  return http({
    url: `/mg/mgmember/info/member/update`,
    method: 'post',
    data
  })
}
// 用户导出
function exportUser(data) {
  return http({
    url: `/mg/mgmember/info/member/Export`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// 获取货代商列表
function getForwarderList(data) {
  return http({
    url: '/forwardertms/forwarderInfo/pageList',
    method: 'post',
    data
  })
}
// 货代商编辑
function forwarderEdit(data) {
  return http({
    url: '/forwardertms/forwarderInfo/editForwarderInfo',
    method: 'post',
    data
  })
}
// 货代商新增
function forwarderAdd(data) {
  return http({
    url: '/forwardertms/forwarderInfo/addForwarderInfo',
    method: 'post',
    data
  })
}
// ERP角色下拉
function erpRoleSelect(data) {
  return http({
    url: `/mg/manager-role/erp/list`,
    method: 'get',
    data
  })
}

// 用户详情
function memberDetails(memberId) {
  return http({
    url: `/mg/mgmember/info/member/details/${memberId}`,
    method: 'get'
  })
}
// 销售额导出
function userSalesExport(data) {
  return http({
    url: '/mg/mgmember/info/member/userSalesExport',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// 查询用户店铺信息
function selectStoreAnalysis(memberId) {
  return http({
    url: `/mg/mgstore/info/selectStoreAnalysis/${memberId}`,
    method: 'get'
  })
}

// 店铺每月销售额
function getAnnualStoreSales(params) {
  return http({
    url: `/mg/mgstore/info/getAnnualStoreSales`,
    method: 'get',
    params
  })
}

// 查询用户操作日志
function selectJournal(memberId) {
  return http({
    url: `/mg/mgmember/info/selectJournal/${memberId}`,
    method: 'get'
  })
}

// 店铺每月销售额
function getMemberInfo(data) {
  return http({
    url: `/mg/setMeal/get/info`,
    method: 'post',
    data
  })
}

// 店铺每月销售额
function memberInfoSaveOrUpdate(data) {
  return http({
    url: `/mg/setMeal/config/info/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 查询货代标签
function selectForwarderLabelList() {
  return http({
    url: '/mg/forwarder/labelList',
    method: 'get'
  })
}

// 获取供应商列表
function getErpSupplier(data) {
  return http({
    url: '/mg/mg/erpSupplier/list',
    method: 'post',
    data
  })
}

// 供应商编辑&新增 看是否有id
function erpSupplierEdit(data) {
  return http({
    url: '/mg/mg/erpSupplier/edit',
    method: 'post',
    data
  })
}

// 营销活动列表
function marketList(data) {
  return http({
    url: '/mg/setMeal/activity/list',
    method: 'post',
    data
  })
}

// 新增-修改营销活动
function editMarket(data) {
  return http({
    url: '/mg/setMeal/activity/save',
    method: 'post',
    data,
    showMessage: false
  })
}

// 获取套餐下拉列表：
function getMarketSelect(data) {
  return http({
    url: '/mg/setMeal/config/select',
    method: 'post',
    data
  })
}

// 停用用户套餐：
function stopUserMember(data) {
  return http({
    url: '/mg/mg/mg-account/disabled/set/meal',
    method: 'post',
    data
  })
}

// 营销推广列表
function getPromotionList(data) {
  return http({
    url: '/mg/erpMarketingExtensionTool/list',
    method: 'get',
    data
  })
}

// 新增 修改推广列表单项
function editPromotionItem(data) {
  return http({
    url: '/mg/erpMarketingExtensionTool/save',
    method: 'post',
    data
  })
}

// 调整推广列表状态 启用/停用
function editPromotionStatus(data) {
  return http({
    url: '/mg/erpMarketingExtensionTool/editStatus',
    method: 'post',
    data
  })
}

// 获取 营销推广详情
function getPromotionContent(data) {
  return http({
    url: '/mg/erpMarketingExtensionTool/get',
    method: 'get',
    data
  })
}

// 获取标签列表
function getUserTagsList() {
  return http({
    url: `/mg/memberLabel/getList`,
    method: 'get'
  })
}

// 分页标签列表
function addUserTagsPage(data) {
  return http({
    url: '/mg/memberLabel/getPage',
    method: 'post',
    data
  })
}

// 添加标签
function addUserTags(data) {
  return http({
    url: '/mg/memberLabel/add',
    method: 'post',
    data
  })
}

// 编辑标签
function eidtUserTags(data) {
  return http({
    url: '/mg/memberLabel/edit',
    method: 'post',
    data
  })
}

// 删除标签
function deleteUserTags(id) {
  return http({
    url: `/mg/memberLabel/delete/${id}`,
    method: 'get'
  })
}

// 查询用户的功能用量
function getUserUseCount(data) {
  return http({
    url: '/mg/mgmember/info/FunctionUse',
    method: 'get',
    data
  })
}

// 查询下载记录
function getDownloadList(data) {
  return http({
    url: '/mg/memberDownloadRecord/query/download/record',
    method: 'get',
    data,
    showLoading: false
  })
}

// 导出文件
function downloadFile(data) {
  return http({
    url: `/mg/memberDownloadRecord/download`,
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export {
  editShop,
  exportShop,
  getInvitationList,
  exportInvitation,
  invitationRelation,
  getUserList,
  putUserInfo,
  exportUser,
  getShopList,
  getForwarderList,
  forwarderEdit,
  forwarderAdd,
  erpRoleSelect,
  memberDetails,
  userSalesExport,
  selectStoreAnalysis,
  getAnnualStoreSales,
  selectJournal,
  getMemberInfo,
  memberInfoSaveOrUpdate,
  selectForwarderLabelList,
  getErpSupplier,
  erpSupplierEdit,
  marketList,
  editMarket,
  getMarketSelect,
  stopUserMember,
  getPromotionList,
  editPromotionItem,
  editPromotionStatus,
  getPromotionContent,
  addUserTags,
  eidtUserTags,
  deleteUserTags,
  getUserTagsList,
  addUserTagsPage,
  getUserUseCount,
  getDownloadList,
  downloadFile
}
