import request from '@/libs/request'

// 分页获取节日列表信息
export const festivalListAPI = (data) => {
  return request({
    url: '/guide/console/festival/list',
    data,
    method: 'post'
  })
}

// 新增或修改节日信息
export const addOrUpdatefestivalAPI = (data) => {
  return request({
    url: '/guide/console/festival/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除节日
export const delectfestivalAPI = (data) => {
  return request({
    url: '/guide/console/festival/del',
    data,
    method: 'post'
  })
}