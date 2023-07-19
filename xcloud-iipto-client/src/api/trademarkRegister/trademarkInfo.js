import request from '@/libs/request';

/**
 * 获取所有的一级类目
 */
export const getOneCategoryApi = (data) => {
  return request({
    url: '/workorder/management/trademark/category/allList',
    data,
    method: 'post',
  });
};

/**
 * 获取指定查询条件的二级目录
 */
export const getSubclassApi = (data) => {
  return request({
    url: '/workorder/management/trademark/category/subCategoryList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取指定查询条件的二级目录有分页
 */
export const getPageSubCategoryApi = (data) => {
  return request({
    url: '/workorder/management/trademark/category/pageSubCategory',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
