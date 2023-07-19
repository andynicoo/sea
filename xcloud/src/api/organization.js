import request from '@/libs/request'

/**
 * 添加部门
 */
export const addDepartment = (data) => {
  return request({
    url: '/base/department/add',
    data,
    method: 'post'
  })
}

/**
 * 分页获取部门数据
 */
export const getDepartmentList = (params) => {
  return request({
    url: '/base/department/page',
    params,
    method: 'get'
  })
}

/**
 * 删除部门
 */
export const removeDepartment = (data) => {
  return request({
    url: '/base/department/remove',
    data,
    method: 'post'
  })
}

/**
 * 编辑部门
 */
export const updateDepartment = (data) => {
  return request({
    url: '/base/department/update',
    data,
    method: 'post'
  })
}

/**
 * 获取所有用户
 */
export const getAllUser = () => {
  return request({
    url: '/base/user/all',
    method: 'get'
  })
}
