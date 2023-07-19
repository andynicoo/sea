import request from '@/libs/request'
/**
 * 分页获取商品列表
 * @param data
 */
export const getGoodsList = (data) => {
  return request({
    url: '/trademark/console/product/management/list',
    data,
    method: 'post'
  })
}

/**
 * 商品详情
 */
export const getGoodsDetail = (data) => {
  return request({
    url: '/trademark/console/product/management/detail',
    data,
    method: 'post'
  })
}

/**
* 添加或修改商品信息
*/
export const updateGoodsDetail = (data) => {
  return request({
    url: '/trademark/console/product/management/addOrUpdate/product',
    data,
    method: 'post'
  })
}