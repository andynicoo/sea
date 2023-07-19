import request from '@/libs/request'

//新闻资讯列表
export const informationList = (data) => {
  return request({
    url: 'trademark/management/bulletins/list',
    data,
    method: 'post'
  })
}

//新闻资讯发布
export const submitInformation = (data) => {
  return request({
    url: 'trademark/management/bulletins/edit/bulletininfo',
    data,
    method: 'post'
  })
}

//删除新闻资讯
export const deleteInformation = (data) => {
  return request({
    url: 'trademark/management/bulletins/del',
    data,
    method: 'post'
  })
}
