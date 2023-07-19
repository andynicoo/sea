import request from '@/utils/request'
const src = 'product/'

/**
 * 加入购物车
 */
export const addCar = (obj) => {
  const data = obj
  return request({
    url: src + 'cart/add',
    data,
    method: 'post'
  })
}
/**
 * 减少购物车
 */
export const deleteNumCar = (obj) => {
  const data = obj
  return request({
    url: src + 'cart/update',
    data,
    method: 'post'
  })
}
/**
 * 购物车列表
 */
export const carList = (obj) => {
  const data = obj
  return request({
    url: src + 'cart/vat/list',
    data,
    method: 'post'
  })
}
/**
 * 删除
 */
export const deleteCar = (obj) => {
  const data = obj
  return request({
    url: src + 'cart/delete',
    data,
    method: 'post'
  })
}
/**
 * 购物车数量
 */
export const getCarNum = (obj) => {
  const data = obj
  return request({
    url: src + 'cart/cartProductCount',
    data,
    method: 'post'
  })
}