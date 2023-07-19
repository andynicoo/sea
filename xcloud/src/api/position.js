import request from '@/libs/request'

/**
 * 获取岗位体系列表
 */
 export const getPosition = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/pageList',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
}

/**
 * 获取岗位体系详情
 */
 export const getPositionInfo = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/info',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  })
}

/**
 * 添加岗位体系
 */
 export const addPosition = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/insert',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
}

/**
 * 添加岗位体系
 */
 export const updatePosition = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/update',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
}

/**
 * 禁用岗位体系
 */
 export const disabledPosition = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/status',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  })
}

/**
 * 删除岗位体系
 */
 export const delPosition = data => {
  return request({
    url: '/base/xcloudRoleDataPermission/delete',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  })
}