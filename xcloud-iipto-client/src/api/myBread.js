import request from '@/libs/request'

/**
 * 获取可添加的监控产品，获取uuid
 */
export const searchGoods = (data) => {
  return request({
    url: '/workorder/client/antiSelling/searchGoods',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 根据uuid查询asin商品
 */
export const getGoodsResp = (data) => {
  return request({
    url: '/workorder/client/antiSelling/getGoodsResp',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取可添加的监控产品
 */
export const getMinitorGoods = (data) => {
  return request({
    url: '/workorder/client/antiSelling/pageAntiSellingMinitorGoods',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 添加监控产品到列表
 */
export const addAntiSellingMinitorGoods = (data) => {
  return request({
    url: '/workorder/client/antiSelling/addAntiSellingMinitorGoods',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除防跟卖监控商品
 */
export const deleAntiSellingMinitorGoods = (data) => {
  return request({
    url: '/workorder/client/antiSelling/deleAntiSellingMinitorGoods',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改防跟卖监控商品
 */
export const updateAntiSellingGoodsMinitorStatus = (data) => {
  return request({
    url: '/workorder/client/antiSelling/updateAntiSellingGoodsMinitorStatus',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 调取监控产品数量
 */
export const getAntiSellingMinitorGoodsNum = (data) => {
  return request({
    url: '/workorder/client/antiSelling/getAntiSellingMinitorGoodsNum',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 防跟卖监控列表
 */
export const pageAntiSellingMinitorGoodsLog = (data) => {
  return request({
    url: '/workorder/client/antiSelling/pageAntiSellingMinitorGoodsLog',
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
