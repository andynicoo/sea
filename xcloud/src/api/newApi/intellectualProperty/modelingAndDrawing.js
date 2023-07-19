import request from '@/libs/request'

// 建模绘图列表
export const modelList = data => {
  return request({
    url: '/workorder/management/modeling_draw/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 建模绘图列表
export const modelInfo = data => {
  return request({
    url: '/workorder/management/modeling_draw/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 建模绘图审核
export const modelAudit = data => {
  return request({
    url: '/workorder/management/modeling_draw/audit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 上传建模绘图文件
export const modelUpload = data => {
  return request({
    url: '/workorder/management/modeling_draw/uploadFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 上传建模绘图文件
export const confirmFile = data => {
  return request({
    url: '/workorder/management/design_patent/confirmFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
