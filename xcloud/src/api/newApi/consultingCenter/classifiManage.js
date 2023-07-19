import request from '@/libs/request';

/**
 * 获取分类列表
 */
export const getDocumentCategoryList = (params) => {
  return request({
    url: '/information/management/documentCategory/page',
    params,
    method: 'get',
  });
};

/**
 * 获取分类详情
 */
export const getDocumentCategoryInfo = (id) => {
  return request({
    url: '/information/management/documentCategory/' + id,
    method: 'get',
  });
};

/**
 * 查询分类
 */
export const getCategoryByModuleType = (moduleType) => {
  return request({
    url: '/information/management/documentCategory/module/' + moduleType,
    method: 'get',
  });
};

/**
 * 新增文章分类
 */
export const addDocumentCategory = (data) => {
  return request({
    url: '/information/management/documentCategory',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改文章分类
 */
export const updateDocumentCategory = (data) => {
  return request({
    url: '/information/management/documentCategory',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除分类
 */
export const delDocumentCategory = (id) => {
  return request({
    url: '/information/management/documentCategory/' + id,
    method: 'delete',
  });
};

/**
 * 禁用/启用分类
 */
export const disabledDocumentCategory = (id, status) => {
  return request({
    url: '/information/management/documentCategory/' + id + '/status/' + status,
    method: 'put',
  });
};

/**
 * 分类设置seo
 */
export const setCategorySeo = (data) => {
  return request({
    url: '/information/management/documentCategory/editSEO',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取关联产品大类
 */
export const getProductBigList = (params) => {
  return request({
    url: '/information/productCategory/getList',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
