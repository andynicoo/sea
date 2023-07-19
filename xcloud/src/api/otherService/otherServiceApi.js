import request from '@/libs/request'
// 获取列表
export const getList = (params) => {
  return request({
    url: '/trademark/management/otherservice/list',
    params,
    method: 'post'
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}
// 批量更新
export const UpdateServiceStatus = (params) => {
  return request({
    url: '/trademark/management/otherservice/batch/UpdateServiceStatus',
    params,
    method: 'post'
  })
}
// 导出列表
export const downloadOtherServiceList = (params) => {
  return request({
    url: '/trademark/management/otherservice/downloadOtherServiceList',
    params,
    method: 'get'
  })
}