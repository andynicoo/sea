import request from '@/libs/request'

// 注册服务列表
export const getIOSSList = (data) => {
  return request({
    url: '/etax/services/ioss/management/reg/list',
    data,
    method: 'post'
  })
}
// IOSS资料注册驳回
export const reject = (data) => {
  return request({
    url: '/etax/services/ioss/management/material/reject',
    data,
    method: 'post'
  })
}
// 录入IOSS税号信息
export const iossInfo = (data) => {
  return request({
    url: '/etax/services/ioss/management/input/iossInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// IOSS工单导出
export const excelList = (data) => {
  return request({
    url: '/etax/services/ioss/management/excelList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// IOSS资料审核
export const material = (data) => {
  return request({
    url: '/etax/services/ioss/management/audit/material',
    data,
    method: 'post'
  })
}
/**
 * 添加/删除备注
 */
export const addOrDeletRemark = (data) => {
  return request({
    url: '/etax/remark/save',
    data,
    method: 'post',
  })
}
/**
 * 备注列表
 */
export const getRemarkList = (data) => {
  return request({
    url: '/etax/remark/list',
    data,
    method: 'post'
  })
}

/**
 * 查看驳回原因列表
 */
export const getRefuseList = (data) => {
  return request({
    url: '/etax/refuse/list',
    data,
    method: 'post'
  })
}
/**
 * 获取注册工单详情
 */
export const getRegDetailInfo = (data) => {
  return request({
    url: '/etax/services/management/detail',
    data,
    method: 'post'
  })
}
/**
 * IOSS修改注册方式
 */
export const workOrderChange = (data) => {
  return request({
    url: '/etax/services/ioss/management/material/workOrderChange',
    data,
    method: 'post'
  })
}
/**
 * IOSS国家信息
 */
export const getCountryByIoss = (data) => {
  return request({
    url: '/etax/baseinfo/list/getCountryByIoss',
    data,
    method: 'post'
  })
}
