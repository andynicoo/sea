import request from '@/libs/request'

//获取用户列表
export const getUserList = (data) => {
  return request({
    url: '/plat/user/list',
    data,
    method: 'post'
  })
}
//获取用户详情
export const getUserDetail = (data) => {
  return request({
    url: '/plat/user/detail',
    data,
    method: 'post'
  })
}
//修改用户账号状态
export const changeUserStatus = (data) => {
  return request({
    url: '/plat/user/batch/change',
    data,
    method: 'post'
  })
}

// 分页获取用户列表
export const getUsersList = (data) => {
  return request({
    url: '/etax/user/management/list',
    data,
    method: 'post'
  })
}

// 获取用户详情
export const getUsersDetail = (data) => {
  return request({
    url: '/etax/user/management/detail',
    data,
    method: 'post'
  })
}

// 批量修改（分配）跟进人
export const updateFollowUsers = (data) => {
  return request({
    url: '/etax/user/management/batch/updatefollowuser',
    data,
    method: 'post',
  })
}

// 批量修改用户状态
export const changeStatus = (data) => {
  return request({
    url: '/etax/user/management/batch/changestatus',
    data,
    method: 'post'
  })
}

// 添加跟进记录
export const addFollowRecord = (data) => {
  return request({
    url: '/etax/user/management/addfollowrecord',
    data,
    method: 'post'
  })
}

// 根据角色获取人员信息
export const roleusers = (params) => {
  return request({
    url: '/etax/user/management/roleusers',
    params,
    method: 'get'
  })
}

// 分页获取我跟进的用户列表
export const myList = (data) => {
  return request({
    url: '/etax/user/management/mylist',
    data,
    method: 'post'
  })
}

// 跟进手机号精准搜索用户
export const searchList = (params) => {
  return request({
    url: '/etax/user/management/searchlist',
    params,
    method: 'post'
  })
}

// 认领用户
export const claim = (data) => {
  return request({
    url: '/etax/user/management/claim',
    data,
    method: 'post'
  })
}

// 获取销售人员个人渠道
export const salesmanChannel = (data) => {
  return request({
    url: '/etax/channel/management/get/salesmanChannel',
    data,
    method: 'post'
  })
}

// 修改用户级别
export const updateUserType = (data) => {
  return request({
    url: '/etax/user/management/update/userType',
    data,
    method: 'post'
  })
}


// 批量修改邀请人
export const updateInviteUser = (data) => {
  return request({
    url: '/etax/user/management/batch/updateInviteUser',
    data,
    method: 'post'
  })
}