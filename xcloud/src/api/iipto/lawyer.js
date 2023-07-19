import request from '@/libs/request'

//律师信息列表
export const lawyerListApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/list',
    data,
    method: 'post'
  })
}

//是否启用律师信息
export const isOpenLawyerApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/open',
    data,
    method: 'post'
  })
}

//删除律师信息
export const deleteLawyerApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/delete',
    data,
    method: 'post'
  })
}

//增加律师信息
export const addLawyerApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/add/attorneyInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//修改律师信息
export const updateLawyerApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/update/attorneyInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//律师详情
export const detailLawyerApi = (data) => {
  return request({
    url: '/trademark/attorneyInfo/detail',
    data,
    method: 'post'
  })
}