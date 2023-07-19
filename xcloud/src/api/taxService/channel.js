import request from '@/libs/request'

//新增或修改推广渠道
export const addAhannelApi = (data) => {
  return request({
    url: '/etax/channel/management/addOrUpdate/channel',
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
    url: '/etax/channel/management/list',
    data,
    method: 'post'
  })
}

//分页渠道推广注册用户列表
export const channelUserListApi = (data) => {
  return request({
    url: '/etax/channel/management/reg/user/list',
    data,
    method: 'post'
  })
}

//分页获取渠道付费用户列表
export const channelPayListApi = (data) => {
  return request({
    url: '/etax/channel/management/pay/user/list',
    data,
    method: 'post'
  })
}

//获取个人渠道列表
export const personageListApi = (data) => {
  return request({
    url: '/etax/channel/management/list/personage',
    data,
    method: 'post'
  })
}

//新增或修改个人推广渠道
export const addPchannelApi = (data) => {
  return request({
    url: '/etax/channel/management/addOrUpdate/personage/channel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


//新增或修改推广用户渠道
export const addChannel = (data) => {
  return request({
    url: '/etax/channel/management/addOrUpdate/promotion/channel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//获取推广用户渠道列表
export const channelList = (data) => {
  return request({
    url: '/etax/channel/management/list/promotion/channel',
    data,
    method: 'post',
  })
}

//推广用户渠道详情信息
export const channelDetail = (data) => {
  return request({
    url: '/etax/channel/management/detail/promotion/channel',
    data,
    method: 'post',
  })
}

//推广用户渠道详情信息
export const statistics = (data) => {
  return request({
    url: '/etax/channel/management/detail/promotion/channel/statistics',
    data,
    method: 'post',
  })
}

//推广用户渠道订单结算
export const clearing = (data) => {
  return request({
    url: '/etax/channel/management/detail/promotion/channel/clearing',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


//推广用户渠道订单结算
export const channelClearingList = (data) => {
  return request({
    url: '/etax/channelClearingList/list',
    data,
    method: 'post',
  })
}

//结算详情
export const channelClearingListDetail = (data) => {
  return request({
    url: '/etax/channelClearingList/detail',
    data,
    method: 'post',
  })
}

// 结算审核
export const channelCheck = (data) => {
  return request({
    url: '/etax/channelClearingList/check',
    data,
    method: 'post',
  })
}


// 结算凭证
export const clearingcertificate = (data) => {
  return request({
    url: '/etax/channelClearingList/upload/Clearingcertificate',
    data,
    method: 'post',

  })
}