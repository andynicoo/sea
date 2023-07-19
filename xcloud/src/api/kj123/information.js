import request from '@/libs/request'

// 分页获取新闻资讯列表信息
export const newsListAPI = (data) => {
  return request({
    url: '/guide/console/news/list',
    data,
    method: 'post'
  })
}

// 新增或修改资讯
export const addOrUpdateNewsAPI = (data) => {
  return request({
    url: '/guide/console/news/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除新闻资讯
export const delectNewsAPI = (data) => {
  return request({
    url: '/guide/console/news/del',
    data,
    method: 'post'
  })
}

// 开启或关闭新闻资讯
export const isOpenNewsAPI = (data) => {
  return request({
    url: '/guide/console/news/open',
    data,
    method: 'post'
  })
}