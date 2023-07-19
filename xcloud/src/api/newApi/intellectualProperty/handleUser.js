import request from '@/libs/request'

// 获取所有处理人类型
export const handlerUserTypeAPI = (data) => {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/handlerUserType',
    data,
    method: 'post'
 })
}

// 修改处理人
export const updateHandlerUserTypeAPI = (data) => {
    return request({
      url: '/workorder/management/trademark/workorder/batchUpdateHandler',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
   })
}