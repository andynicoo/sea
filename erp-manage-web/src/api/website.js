import http from '@/utils/request'
/**
 * 分类新增
 * @param mainType 1、新闻分类，2、案例分类
 * @param sort 排序
 * @param typeName 子类名称
 */
function classifyAdd(data) {
  return http({
    url: '/mg/file-type/add',
    method: 'post',
    data
  })
}
/**
 * 分类编辑
 * @param mainType 1、新闻分类，2、案例分类
 * @param sort 排序
 * @param typeName 子类名称
 */
function classifyUpdate(data) {
  return http({
    url: '/mg/file-type/edit',
    method: 'post',
    data
  })
}
/**
 * 分类下拉select
 * @param mainType 1、新闻分类，2、案例分类
 * @param sort 排序
 * @param typeName 子类名称
 */
function classifySelect(data) {
  return http({
    url: '/mg/file-type/getList',
    method: 'post',
    data
  })
}
/** 分类列表
 * @param mainType 1、新闻分类，2、案例分类
 * @param sort 排序
 * @param typeName 子类名称
 */
function classifyList(data) {
  return http({
    url: '/mg/file-type/getPage',
    method: 'post',
    showLoading: false,
    data
  })
}
/** 分类删除
 * @param ids{Array} 分类的id
 * @param mainType{Number} 主类型
 */
function classifyDelete(data) {
  return http({
    url: '/mg/file-type/del',
    method: 'post',
    data
  })
}
/** 新闻与案例新增
 * @param mainType{Number} 主类型
 */
function newsOrCashAdd(data) {
  return http({
    url: '/mg/mgNwesExamaple/add',
    method: 'post',
    data
  })
}
/** 新闻与案例删除
 * @param ids{Array} id
 * @param mainType{Number} 主类型
 */
function newsOrCashDelete(data) {
  return http({
    url: '/mg/mgNwesExamaple/del',
    method: 'post',
    data
  })
}
/** 新闻与案例编辑
 * @param id{Number} id
 * @param imgs{String} 封面图
 * @param mainType{Number} 主类型 2：新闻 3：案例
 * @param preview{String} 预览内容
 * @param status{Number} 状态
 * @param reading{Number} 阅读量
 * @param content{String} 正文
 */
function newsOrCashEdit(data) {
  return http({
    url: '/mg/mgNwesExamaple/edit',
    method: 'post',
    data
  })
}
/** 新闻或案例列表
 * @param title 标题
 * @param type 分类的code
 * @param mainType{Number} 主类型 2：新闻 3：案例
 */
function newsOrCashList(data) {
  return http({
    url: '/mg/mgNwesExamaple/getPage',
    method: 'post',
    data
  })
}
/** 以id查新闻或列表详情
 * @param id{Number} id
 */
function getNewsOrCashDetail(id) {
  return http({
    url: `/mg/mgNwesExamaple/${id}`,
    method: 'post'
  })
}
/** 使用教程新增
 * @param title{String} 标题
 * @param type{Number} 分类的code
 * @param sort{Number} 排序
 * @param status{Number} 状态
 * @param content{String} 正文内容
 */
function helpAdd(data) {
  return http({
    url: '/mg/mgTutorial/add',
    method: 'post',
    data
  })
}
// 教程删除
function helpDelete(data) {
  return http({
    url: '/mg/mgTutorial/del',
    method: 'post',
    data
  })
}
/** 使用教程编辑
 * @param title{String} 标题
 * @param type{Number} 分类的code
 * @param sort{Number} 排序
 * @param status{Number} 状态
 * @param content{String} 正文内容
 */
function helpEdit(data) {
  return http({
    url: '/mg/mgTutorial/edit',
    method: 'post',
    data
  })
}
// 教程列表
function helpList(data) {
  return http({
    url: '/mg/mgTutorial/getPage',
    method: 'post',
    data
  })
}
// id查帮助教程详情
function helpDetail(id) {
  return http({
    url: `/mg/mgTutorial/${id}`,
    method: 'post'
  })
}
/** 广告列表
 * @params advertisingKey 广告位置
 * @params name 广告名称
 * @params type 1:友情链接 2:广告列表
 */
function advertisingList(data) {
  return http({
    url: `/mg/mg-advertising/getPage`,
    method: 'post',
    data
  })
}
/** 广告新增
 * @params advertisingKey 广告位置
 * @params name 广告名称
 * @params type 1:友情链接 2:广告列表
 * @params advertisingDescribe 描述
 * @params imgs 广告图
 * @params link 广告链接
 * @params status 是否启用 1:否 0:是
 * @params sort 排序
 */
function advertisingAdd(data) {
  return http({
    url: `/mg/mg-advertising/add`,
    method: 'post',
    data
  })
}
/** 广告编辑
 * @params advertisingKey 广告位置
 * @params id 广告id
 * @params name 广告名称
 * @params type 1:友情链接 2:广告列表
 * @params advertisingDescribe 描述
 * @params imgs 广告图
 * @params link 广告链接
 * @params status 是否启用 1:否 0:是
 * @params sort 排序
 */
function advertisingEdit(data) {
  return http({
    url: `/mg/mg-advertising/edit`,
    method: 'post',
    data
  })
}
/** 广告删除
 * @params ids{Array} 广告id
 * @params type 1:友情链接 2:广告列表
 */
function advertisingDelete(data) {
  return http({
    url: `/mg/mg-advertising/del`,
    method: 'post',
    data
  })
}
/** 全部广告位
 * @params status true:启用 false:未启用
 */
function advertisingSelect(data) {
  return http({
    url: `/mg/mg-advertising-location/getList`,
    method: 'post',
    data
  })
}
// 广告位列表
function adList(data) {
  return http({
    url: `/mg/mg-advertising-location/getPage`,
    method: 'post',
    data
  })
}
// 广告位编辑
function adEdit(data) {
  return http({
    url: `/mg/mg-advertising-location/edit`,
    method: 'post',
    data
  })
}
// 广告位新增
function adAdd(data) {
  return http({
    url: `/mg/mg-advertising-location/add`,
    method: 'post',
    data
  })
}
// 广告位删除
function adDelete(data) {
  return http({
    url: `/mg/mg-advertising-location/del`,
    method: 'post',
    data
  })
}
/** 消息新增
 */
function messageAdd(data) {
  return http({
    url: `/message/notice/save`,
    method: 'post',
    data
  })
}
/** 消息编辑
 */
function messageEdit(data) {
  return http({
    url: `/message/notice/edit`,
    method: 'post',
    data
  })
}
/** 消息列表
 */
function messageList(data) {
  return http({
    url: `/message/notice/mgPublishList`,
    method: 'post',
    data
  })
}
/** 删除消息
 */
function delMessage(data) {
  return http({
    url: `/message/notice/del`,
    method: 'post',
    data
  })
}

/** 获取返利描述
 */
function rebateGet(data) {
  return http({
    url: `/mg/mg-advertising/rebate/get`,
    method: 'get',
    data
  })
}

/** 编辑返利描述
 */
function rebateEdit(data) {
  return http({
    url: `/mg/mg-advertising/rebate/edit`,
    method: 'post',
    data
  })
}

export {
  classifyAdd,
  classifyUpdate,
  classifySelect,
  classifyList,
  classifyDelete,
  newsOrCashAdd,
  newsOrCashDelete,
  newsOrCashEdit,
  newsOrCashList,
  helpAdd,
  helpEdit,
  helpList,
  getNewsOrCashDetail,
  helpDetail,
  helpDelete,
  advertisingList,
  advertisingAdd,
  advertisingDelete,
  advertisingEdit,
  advertisingSelect,
  adList,
  adEdit,
  adAdd,
  adDelete,
  messageAdd,
  messageEdit,
  messageList,
  delMessage,
  rebateGet,
  rebateEdit
}
