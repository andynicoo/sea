import request from '@/libs/request';

/**
 * 获取商标分类列表
 */
export const getTradeMarkCateGory = (data) => {
  return request({
    url: '/workorder/management/trademark/category/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取商标分类不分页列表
 */
export const getTradeMarkConditionList = (params) => {
  return request({
    url: '/workorder/management/trademark/category/conditionList',
    params,
    method: 'get',
  });
};

/**
 * 获取商标分类详情
 */
export const getTradeMarkCateGoryInfo = (params) => {
  return request({
    url: '/workorder/management/trademark/category/info',
    params,
    method: 'get',
  });
};

/**
 * 添加商标分类
 */
export const addCategory = (data) => {
  return request({
    url: '/workorder/management/trademark/category/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 更新商标分类
 */
export const updateCategory = (data) => {
  return request({
    url: '/workorder/management/trademark/category/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除商标分类
 */
export const deleteCategory = (data) => {
  return request({
    url: '/workorder/management/trademark/category/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 获取商标小类
 */
export const getTradeMarkSubCateGory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    interrupt: true,
  });
};

/**
 * 获取商标小类详情
 */
export const getTradeMarkSubCateGoryInfo = (params) => {
  return request({
    url: '/workorder/management/trademark/subcategory/info',
    params,
    method: 'get',
  });
};

/**
 * 添加商标小类
 */
export const addSubCateGory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 更新商标小类
 */
export const updateSubCateGory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除商标小类
 */
export const deleteSubCateGory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 导出商标小类EXCEL列表
 */
export const categoryImportFile = (data) => {
  return request({
    url: '/workorder/management/trademark/category/excel/importFile',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 导出商标小类模板
 */
export const categoryTemplate = (data) => {
  return request({
    url: '/workorder/management/trademark/category/excel/template',
    data,
    method: 'get',
    responseType: 'blob',
  });
};

/**
 * 上传商标小类文件
 */
export const uploadFile = (data) => {
  return request({
    url: '/workorder/management/trademark/category/excel/uploadFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 下载失败的商标小类数据
 */
export const downLoadFailFile = (data) => {
  return request({
    url: '/workorder/management/trademark/category/excel/downLoadFailFile',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 查询当前登录用户导入文件名结果
 */
export const importRecord = (params) => {
  return request({
    url: '/workorder/management/import_record',
    params,
    method: 'get',
  });
};

/**
 * 获取国家小类模板
 */
export const getCountryTemplates = (params) => {
  return request({
    url: '/workorder/management/trademark/category/excel/getCountryTemplates',
    params,
    method: 'get',
  });
};

/**
 * 批量删除商标小类
 */
export const batchDelSubCategory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/delateBatch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 批量审核/确认商标小类
 */
export const batchAuditSubCategory = (data) => {
  return request({
    url: '/workorder/management/trademark/subcategory/batchAudit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
