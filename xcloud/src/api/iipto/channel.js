import request from '@/libs/request'

//新增或修改推广渠道
export const addAhannelApi = (data) => {
  return request({
    url: '/trademark/management/channel/addOrUpdate/channel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//获取渠道推广列表
export const getChannelListApi = (data) => {
  return request({
    url: '/trademark/management/channel/list',
    data,
    method: 'post'
  })
}

//分页渠道推广注册用户列表
export const channelUserListApi = (data) => {
  return request({
    url: '/trademark/management/channel/reg/user/list',
    data,
    method: 'post'
  })
}

//分页获取渠道付费用户列表
export const channelPayListApi = (data) => {
  return request({
    url: '/trademark/management/channel/pay/user/list',
    data,
    method: 'post'
  })
}

//获取个人渠道列表
export const personageListApi = (data) => {
  return request({
    url: '/trademark/management/channel/list/personage',
    data,
    method: 'post'
  })
}

//新增或修改个人推广渠道
export const addPchannelApi = (data) => {
  return request({
    url: '/trademark/management/channel/addOrUpdate/personage/channel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

