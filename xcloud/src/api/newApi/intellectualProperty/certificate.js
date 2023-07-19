import request from '@/libs/request'

// 授权书列表
export const certificateList = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 授权书详情
export const certificateInfo = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 提交授权书
export const submitAuthorization = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/submitAuthorization',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 上传授权回执
export const uploadAuthorizationReceiptFile = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/uploadAuthorizationReceiptFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除授权书
export const authorizationDel = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/del',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 翻译授权书
export const authorizationTranslate = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/translate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 上传授权书官方文件
export const uploadAuthorizationFile = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/uploadAuthorizationFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 上传授权书官方文件
export const updateAuthorizationFile = data => {
  return request({
    url: '/workorder/management/design_patent_authorization/updateAuthorizationFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}