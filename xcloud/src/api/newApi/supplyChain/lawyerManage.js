import request from '@/libs/request'
/**
 * 获取律师列表
 */
export const getLawyerList = data => {
    return request({
        url: '/workorder/management/attorney/pageList',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取律师详情
 */
 export const getAttorneyInfoById = params => {
  return request({
      url: '/workorder/management/attorney/info',
      params,
      method: 'get'
  })
}

/**
 * 更改律师禁用状态
 */
 export const activateAttorneyDisabledState = params => {
  return request({
      url: '/workorder/management/attorney/activateAttorneyDisabledState',
      params,
      method: 'get'
  })
}

/**
 * 删除律师
 */
 export const deleteAttorneyInfo = params => {
  return request({
      url: '/workorder/management/attorney/delete',
      params,
      method: 'delete',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
  })
}

/**
 * 更新律师信息
 */
 export const updateLawyer = data => {
  return request({
      url: '/workorder/management/attorney/update',
      data,
      method: 'put',
      headers: {
          'Content-Type': 'application/json'
      }
  })
}

/**
 * 新增律师
 */
 export const addLawyer = data => {
  return request({
      url: '/workorder/management/attorney/add',
      data,
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      }
  })
}