import request from '@/libs/request'
import qs from 'qs'

// 专利列表
export const getPatentList = (data) => {
  return request({
    url: '/workorder/client/design_patent/page?' + qs.stringify(data),
    method: 'get'
  })
}

// 专利费用信息
export const getCostInfo = data => {
  return request({
    url: '/workorder/client/design_patent/costBreakdown',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 获取表单信息
export const getPatentDetail = data => {
  return request({
    url: `/workorder/client/design_patent/${data}`,
    method: 'get'
  })
}

// 提交资料
export const submitInfo = data => {
  return request({
    url: '/workorder/client/design_patent/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 保存资料
export const saveInfo = data => {
  return request({
    url: '/workorder/client/design_patent/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 快递信息
export const updateAdress = data => {
  return request({
    url: '/workorder/client/design_patent/address',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 确认文件
export const confirmFile = data => {
  return request({
    url: '/workorder/client/design_patent/confirmFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 答复OA
export const answerOa = data => {
  return request({
    url: '/workorder/client/design_patent/answerOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 放弃答复OA
export const quitAnswerOa = data => {
  return request({
    url: '/workorder/client/design_patent/giveupOa',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 提交绘图文件
export const submitDrawFile = data => {
  return request({
    url: '/workorder/client/design_patent/uploadFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
