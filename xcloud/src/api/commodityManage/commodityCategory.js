import request from '@/libs/request'

/**
 * 获取分类列表
 */
export const getCategoryList = (data) => {
  return request({
    url: '/productserver/category/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 添加/编辑类目
 */
export const addOrEditCategory = (data) => {
  return request({
    url: '/productserver/category/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 分类详情
 */
export const getCategoryDetails = (params) => {
  return request({
    url: '/productserver/category/detail',
    params,
    method: 'get'
  })
}
/**
 * 删除分类
 */
export const deleteCategory = (data) => {
  return request({
    url: '/productserver/category/remove',
    data,
    method: 'post'
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
 * 新增分类属性
 */
export const addAttrs = (data) => {
  return request({
    url: '/productserver/attribute/category/attr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 删除分类属性
 */
export const deleteAttrs = (data) => {
  return request({
    url: '/productserver/attribute/delete',
    data,
    method: 'post'
  })
}
/**
 * 分类属性详情
 */
export const attrsDetail = (data) => {
  return request({
    url: '/productserver/attribute/detail',
    data,
    method: 'post'
  })
}
/**
 * 属性下拉框(有效的值)
 */
export const attrsSelect = (data) => {
  return request({
    url: '/productserver/attribute/selected',
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
