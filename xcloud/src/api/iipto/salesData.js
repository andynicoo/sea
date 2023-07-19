import request from '@/libs/request'

//销售数据分析
export const salesDataApi = (data) => {
  return request({
    url: '/trademark/saleStatics/management/saleData/analyse',
    data,
    method: 'post'
  })
}

//销售数据信息列表
export const salesListApi = (data) => {
  return request({
    url: '/trademark/saleStatics/management/saleData/list',
    data,
    method: 'post'
  })
}
