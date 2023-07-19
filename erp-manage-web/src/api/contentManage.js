import http from '@/utils/request'
// 获取内容列表
function getContentList(data) {
  return http({
    url: '/mg/mg/content/qa/list',
    method: 'post',
    data
  })
}
// 更新内容
function putContent(data) {
  return http({
    url: '/mg/mg/content/qa/edit',
    method: 'post',
    data
  })
}
// 新增内容
function addContent(data) {
  return http({
    url: '/mg/mg/content/qa/add',
    method: 'post',
    data
  })
}
// 更新内容
function deleteContent(data) {
  return http({
    url: '/mg/mg/content/qa/delete',
    method: 'post',
    data
  })
}
// 意见反馈列表
function getFeedback(data) {
  return http({
    url: '/mg/mg/content/feedback/list',
    method: 'post',
    data
  })
}
// 意见反馈列表
function adoptOpinion(data) {
  return http({
    url: '/mg/mg/content/feedback/adopt',
    method: 'post',
    data
  })
}
// 一键开店列表
function openShopKey(data) {
  return http({
    url: '/mg/mg/store/open/shop/page',
    method: 'post',
    data
  })
}
// 修改商品
function editShop(data) {
  return http({
    url: '/mg/mg/store/open/shop/edit',
    method: 'post',
    data
  })
}
// 失败原因列表
function failureList(data) {
  return http({
    url: '/mg/mg/goods-shopee-error-reasons/getPage',
    method: 'post',
    data
  })
}
// 失败原因列表
function failEdit(data) {
  return http({
    url: '/mg/mg/goods-shopee-error-reasons/edit',
    method: 'post',
    data
  })
}
// 使用说明列表
function directionList(params) {
  return http({
    url: '/mg/mg/content-info/page',
    params
  })
}
// 获取分类列表
function getClassifyList(params) {
  return http({
    url: '/mg/mg/content-classify/list',
    params
  })
}
// 保存分类
function classifySava(data) {
  return http({
    url: '/mg/mg/content-classify/save',
    method: 'post',
    data
  })
}
// 更新分类
function classifyUpdate(data) {
  return http({
    url: '/mg/mg/content-classify/update',
    method: 'post',
    data
  })
}
// 删除分类
function classifyDelete(id) {
  return http({
    url: `/mg/mg/content-classify/remove/${id}`,
    method: 'post'
  })
}
// 内容更新
function contentUpdate(data) {
  return http({
    url: `/mg/mg/content-info/update`,
    method: 'post',
    data
  })
}
// 内容新增
function contentAdd(data) {
  return http({
    url: `/mg/mg/content-info/save`,
    method: 'post',
    data
  })
}
// 内容删除
function contentDelete(id) {
  return http({
    url: `/mg/mg/content-info/remove/${id}`,
    method: 'post'
  })
}
// 站内信消息列表
function erpMessageList(data) {
  return http({
    url: `/mg/manager-mail/page`,
    method: 'post',
    data
  })
}
// 获取所有有效消息列表
function erpMessageAllList(data) {
  return http({
    url: `/mg/manager-mail/available`,
    data
  })
}
// 站内信消息详情
function erpMessageDetail(data) {
  return http({
    url: `/mg/manager-mail/detail`,
    data
  })
}
// 新增站内信消息
function erpMessageAdd(data) {
  return http({
    url: `/mg/manager-mail/add`,
    method: 'post',
    data
  })
}
// 编辑站内信消息
function erpMessageEdit(data) {
  return http({
    url: `/mg/manager-mail/edit`,
    method: 'post',
    data
  })
}
// 删除站内信消息
function erpMessageDelete(data) {
  return http({
    url: `/mg/manager-mail/delete`,
    method: 'post',
    data
  })
}

export {
  getContentList,
  putContent,
  addContent,
  deleteContent,
  getFeedback,
  adoptOpinion,
  openShopKey,
  editShop,
  failureList,
  failEdit,
  directionList,
  getClassifyList,
  classifySava,
  classifyDelete,
  classifyUpdate,
  contentUpdate,
  contentAdd,
  contentDelete,
  erpMessageList,
  erpMessageDetail,
  erpMessageAdd,
  erpMessageEdit,
  erpMessageDelete,
  erpMessageAllList
}
