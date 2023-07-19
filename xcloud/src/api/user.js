import request from '@/libs/request'
import { getToken } from '@/libs/util'
import config from '@/config'

/**
 * 用户登录
 * @param username
 * @param password
 */
export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return request({
    url: 'admin/login/token',
    data,
    method: 'post'
  })
}

/**
 * 登出
 */
export const logout = () => {
  return request({
    url: 'admin/logout/token',
    data: { token: getToken() },
    method: 'post'
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: 'admin/current/user',
    method: 'get'
  })
}

/**
 * 获取登录用户菜单权限
 */
export const getCurrentUserMenu = () => {
  const params = {
    serviceId: config.serviceId
  }
  return request({
    url: 'base/current/user/menu',
    params,
    method: 'get'
  })
}

export const updateCurrentUserInfo = ({ nickName, userDesc, avatar }) => {
  const data = {
    nickName: nickName,
    userDesc: userDesc,
    avatar: avatar
  }
  return request({
    url: 'base/current/user/update',
    data,
    method: 'post'
  })
}

/**
 * 获取用户列表
 * @param params
 */
export const getUsers = params => {
  return request({
    url: 'base/user',
    params,
    method: 'get'
  })
}

/**
 * 获取所有用户列表
 */
export const getAllUsers = () => {
  return request({
    url: 'base/user/all',
    method: 'get'
  })
}

/**
 * 添加用户信息
 * @param userName
 * @param password
 * @param nickName
 * @param status
 * @param userType
 * @param email
 * @param mobile
 * @param userDesc
 * @param avatar
 */
export const addUser = data => {
  return request({
    url: 'base/user/add',
    data,
    method: 'post'
  })
}

/**
 * 更新用户信息
 */
export const updateUser = data => {
  return request({
    url: 'base/user/update',
    data,
    method: 'post'
  })
}

/**
 * 分配用户角色
 * @param data
 */
export const addUserRoles = ({ userId, grantRoles }) => {
  const data = { userId: userId, roleIds: grantRoles.join(',') }
  return request({
    url: 'base/user/roles/add',
    data,
    method: 'post'
  })
}

/**
 * 获取用户角色
 * @param userId
 */
export const getUserRoles = userId => {
  const params = {
    userId: userId
  }
  return request({
    url: 'base/user/roles',
    params,
    method: 'get'
  })
}

/**
 * 修改密码
 * @param userId
 * @param password
 */
export const updatePassword = ({ userId, password }) => {
  const data = {
    userId: userId,
    password: password
  }
  return request({
    url: 'base/user/update/password',
    data,
    method: 'post'
  })
}

/**
 * 修改用户登录密码
 */
export const changePassword = data => {
  return request({
    url: '/base/current/user/rest/password',
    data,
    method: 'post'
  })
}

/**
 * 修改管理员密码
 */
export const changeManagerPwd = data => {
  return request({
    url: '/base/user/selfSetPwd',
    data,
    method: 'post'
  })
}

/**
 * 修改用户登录密码
 */
export const getBaseUserInfo = params => {
  return request({
    url: '/base/user/info',
    params,
    method: 'get'
  })
}

/**
 * 修改启用用户列表
 */
export const getUserNormal = params => {
  return request({
    url: '/base/user/all/normal',
    params,
    method: 'get'
  })
}

/**
 * 获取用户企业列表
 */
export const getUserCompany = data => {
  return request({
    url: '/base/xcloudUserEnterprise/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改用户企业
 */
export const setUserCompany = data => {
  return request({
    url: '/base/xcloudUserEnterprise/updateBatch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 重置密码
 */
export function setPassword (id) {
  return request({
    url: '/base/user/restPwd?userId=' + id,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
