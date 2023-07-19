import request from '@/libs/request'

/**
 * 服务查询列表
 */
export const getRenewalList = params => {
    return request({
        url: '/workorder/management/renewal_work_order/page',
        params,
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 导出
 */
 export const renewalExport = params => {
  return request({
      url: '/workorder/management/renewal_work_order/export',
      params,
      method: 'get',
      responseType: 'blob',
      headers: {
          'Content-Type': 'application/json'
      }
  })
}