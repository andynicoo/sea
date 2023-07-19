import request from '@/libs/request'

// 根据服务Id创建申报年度评估工单
export const creatAnnalsApi = (data) => {
  return request({
    url: '/etax/services/management/tax/create/year',
    data,
    method: 'post'
  })
}

// 申报年度评估记录详情
export const deAnnalsApiDetail = (data) => {
  return request({
    url: '/etax/services/management/tax/yeartax/detail',
    data,
    method: 'post'
  })
}

// 报税保存资料--保存操作（德国年报）
export const deAnnalsSaveApi = (data) => {
  return request({
    url: '/workorder/management/taxWorkOrderYear/year/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

// 报税确认提交资料--提交操作（德国年报）
export const deAnnalsSubmitApi = (data) => {
  return request({
    url: '/etax/tax/workorder/management/year/submit',
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
    url: '/etax/tax/workorder/management/year/confirm',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


// 年报工单列表
export const annalsDetailDElist = (data) => {
  return request({
    url: '/etax/tax/workorder/management/year/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
