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