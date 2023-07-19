import request from '@/libs/request'

/**
 * 获取所有区域信息
 */
export const getCountryListApi = () => {
  return request({
    url: '/trademark/base/area/list',
    method: 'get'
  })
}

/**
 * 缓存中获取国家数据
 */
export const getCacheCountryListApi = () => {
  return request({
    url: '/order/management/country/countryList',
    method: 'post'
  })
}

export const getInfoDetailCacheCountry = (url) => {
  return request({
    url,
    method: 'post'
  })
}
