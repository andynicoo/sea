import request from '@/libs/request'

//查询服务国家编号及名称列表
export const getServiceCountry = () => {
  return request({
    url: '/trademark/console/product/management/findServiceCountryNameList',
    method: 'post'
  })
}