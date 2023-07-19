import request from '@/utils/request'

/**
 * 申报年度评估记录
 */
export const annalsDetailDE = (data) => {
  return request({
    url: '/etax/user/tax/yeartax',
    data,
    method: 'post'
  })
}

/**
 * 申报年度评估记录(单独页面列表)
 */
 export const annalsDetailDElist = (data) => {
  return request({
    // url: '/etax/user/client/year/page',
    url: '/workorder/client/vat/workOrderYear/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 申报年度评估记录详情
 */
export const deAnnalsApiDetail = (data) => {
  return request({
    // url: '/etax/user/tax/yeartax/detail',
    url: '/workorder/client/vat/workOrderYear/material/detail',
    data,
    method: 'post'
  })
}



// 报税保存资料--保存操作（德国年报）
export const deAnnalsSaveApi = (data) => {
  return request({
    // url: '/etax/user/year/save',
    url: '/workorder/client/vat/workOrderYear/material/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 报税确认提交资料--提交操作（德国年报）
export const deAnnalsSubmitApi = (data) => {
  return request({
    // url: '/etax/user/year/submit',
    url: '/workorder/client/vat/workOrderYear/material/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 报税确认提交资料--确认提交操作（德国年报）
export const deAnnalsSureSubmitApi = (data) => {
  return request({
    // url: '/etax/user/year/confirm',
    url: '/workorder/client/vat/workOrderYear/year/confirm',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}