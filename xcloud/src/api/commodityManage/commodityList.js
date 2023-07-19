import request from '@/libs/request'

/**
 * 获取商品列表
 */
export const getProductList = (data) => {
  return request({
    url: '/productserver/product/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 商品列表-数据汇总统计
 */
export const statisticsInfo = (data) => {
  return request({
    url: '/productserver/product/list/statistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 分类下拉框(有效的值)
 */
export const getCategoryItem = (data) => {
  return request({
    url: '/productserver/category/selectedShowflag',
    data,
    method: 'post'
  })
}
/**
 * 修改商品发布平台(批量)
 */
export const updatePlatform = (data) => {
  return request({
    url: '/productserver/product/updatePlatform/batch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 商品审核
 */
export const productVerify = (data) => {
  return request({
    url: '/productserver/product/productVerify',
    data,
    method: 'post'
  })
}
/**
 * 商品上下架
 */
export const productUpstatus = (data) => {
  return request({
    url: '/productserver/product/productUpstatus',
    data,
    method: 'post'
  })
}
/**
 * 商品作废/还原
 */
export const productCancelStatus = (data) => {
  return request({
    url: '/productserver/product/productCancelStatus',
    data,
    method: 'post'
  })
}
/**
 * 删除商品
 */
export const deleteProduct = (data) => {
  return request({
    url: '/productserver/product/deleteProduct',
    data,
    method: 'post'
  })
}
/**
 * 商品日志集合
 */
export const productLog = (data) => {
  return request({
    url: '/productserver/productLog/list',
    data,
    method: 'post'
  })
}
/**
 * 新增和编辑商品信息数据
 */
export const addOrUpdateProduct = (data) => {
  return request({
    url: '/productserver/product/addOrUpdateProduct',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 查询分类下的属性列表
 */
export const getAttrList = (data) => {
  return request({
    url: '/productserver/category/attrs',
    data,
    method: 'post'
  })
}
/**
 * 查询商品数据明细
 */
export const getProductDetailes = (data) => {
  return request({
    url: '/productserver/product/getProductDetailes',
    data,
    method: 'post'
  })
}
/**
 * 国家信息列表
 */
export const allList = (params) => {
  return request({
    url: '/common/country/allList',
    params,
    method: 'get'
  })
}
/**
 * 获取商品类型下拉列表
 */
export const getProductTypeList = (params) => {
  return request({
    url: '/productserver/product/list/types',
    params,
    method: 'get'
  })
}
