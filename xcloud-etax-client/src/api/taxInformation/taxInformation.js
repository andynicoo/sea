import request from '@/utils/request'

/**
 * 税务咨询列表及分类
 */
export const vatList = (params) => {
  return request({
    url: 'kjapi/v1/vat_article/list',
    params,
    method: 'get'
  })
}
/**
 * 税务咨询文章详情
 */
export const vatArticleDetail = (params) => {
  return request({
    url: 'kjapi/v1/article/info',
    params,
    method: 'get'
  })
}
