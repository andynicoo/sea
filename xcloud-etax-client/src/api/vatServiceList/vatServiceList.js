import request from '@/utils/request'

/**
 * 分页获取商品列表
 */
export const productList = (params) => {
  const data = params
  return request({
    url: '/product/client/product/productlist',
    data,
    method: 'post'
  })
}

/**
 * 获取商品详情
 */
export const productDetail = (params) => {
  const data = params
  return request({
    url: '/product/client/product/productDetail',
    data,
    method: 'post'
  })
}
/**
 * APP/PC创建订单
 */
export const createVatOrder = (params) => {
  const data = params
  return request({
    url: '/orderserver/order/createVatOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 根据属性列表获取SKU
 */
export const getSku = (params) => {
  const data = params
  return request({
    url: '/product/productSku/getSku',
    data,
    method: 'post'
  })
}
