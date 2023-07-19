import request from '@/libs/request'

/**
 * 刷新国家配置信息缓存
 */
export const countryApi = () => {
  return request({
    url: '/trademark/cache/updateBaseInfoCache',
    method: 'get'
  })
}

/**
 * 刷新产品信息缓存
 */
export const productApi = () => {
  return request({
    url: '/trademark/cache/updateVatProductCache',
    method: 'get'
  })
}

/**
 * 刷新类目信息缓存
 */
export const updateTrademarkCategoryCacheApi = () => {
  return request({
    url: '/trademark/cache/updateTrademarkCategoryCache',
    method: 'get'
  })
}