import request from '@/libs/request'

/**
 * 获取所有的一级类目
 */
export const getOneCategoryApi = (data) => {
  return request({
    url: '/trademark/client/category/get/One/category',
    data,
    method: 'post'
  })
}

/**
 * 获取指定查询条件的二级目录
 */
export const getTwoCategoryApi = (data) => {
  return request({
    url: '/trademark/client/category/get/category/bySearchName',
    data,
    method: 'post'
  })
}

/**
 * 获取指定查询条件的二级目录
 */
export const getSubclassApi = (data) => {
  return request({
    url: '/trademark/client/category/get/category/by/quanqiutm',
    data,
    method: 'post'
  })
}

/**
 * 保存或修改商标注册资料
 */
export const saveWorkorderApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/add/workorder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 商标注册详情
 */
export const trademarkDetailApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/detail',
    data,
    method: 'post'
  })
}

/**
 * 提交商标注册资料
 */
export const submitWorkorderApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/submit/workorder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 注册资料审核驳回
 */
export const workorderRejectApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/reject/material',
    data,
    method: 'post'
  })
}

/**
 * 注册资料审核通过
 */
export const workorderAssignApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/assign/attorney',
    data,
    method: 'post'
  })
}

/**
 * 根据国家编码获取律师列表
 */
export const getLawyerInfoApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/get/attorneyInfo/bycountrycode',
    data,
    method: 'post'
  })
}

/**
 * 添加商标局受理信息
 */
export const acceptInfoApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/add/acceptInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 文件OA工单列表
 */
export const fileOaListApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/list/fileOa',
    data,
    method: 'post'
  })
}

/**
 * 文件上传
 */
export const addFileOaApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/add/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改上传文件
 */
export const updateFileOaApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/update/fileOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除文件
 */
export const delFileOaApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/del/fileOa',
    data,
    method: 'post'
  })
}

/**
 * 翻译OA
 */
export const translateOaApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/translate/oa',
    data,
    method: 'post'
  })
}

/**
 * 翻译暂停信
 */
export const translatStopLettereApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/translate/stopLetter',
    data,
    method: 'post'
  })
}

/**
 * 取消暂停信
 */
export const cancelStopLettereApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/cancel/stopLetter',
    data,
    method: 'post'
  })
}

/**
 * 驳回答复材料
 */
export const rejectAnswerApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/reject/answer/materials',
    data,
    method: 'post'
  })
}

/**
 * 审批通过答复材料
 */
export const passAnswerApi = (data) => {
  return request({
    url: '/trademark/fileOaWorkOrder/pass/answer/materials',
    data,
    method: 'post'
  })
}

/**
 * 初审审核通过
 */
export const firstAuditApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/first/approved',
    data,
    method: 'post'
  })
}