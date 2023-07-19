import request from '@/libs/request';

/**
 * 获取资讯列表
 */
export const getNewsDocumentList = (params) => {
  return request({
    url: '/information/management/newsDocument/page',
    params,
    method: 'get',
  });
};

/**
 * 获取资讯回显详情
 */
export const getNewsDocumentInfo = (id) => {
  return request({
    url: '/information/management/newsDocument/' + id,
    method: 'get',
  });
};

/**
 * 获取资讯详细详情
 */
export const getNewsDocumentAllInfo = (id) => {
  return request({
    url: '/information/management/newsDocument/item/' + id,
    method: 'get',
  });
};

/**
 * 发布资讯
 */
export const addNewsDocument = (data) => {
  return request({
    url: '/information/management/newsDocument',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 编辑资讯
 */
export const updateNewsDocument = (data) => {
  return request({
    url: '/information/management/newsDocument/',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量下载
 */
export const download = (data) => {
  return request({
    url: '/information/management/newsDocument/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * 批量删除
 */
export const batchDelete = (data) => {
  return request({
    url: '/information/management/newsDocument/batchDel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除资讯
 */
export const delNewsDocument = (id) => {
  return request({
    url: '/information/management/newsDocument/' + id,
    method: 'delete',
  });
};

/**
 * 禁用/启用资讯
 */
export const disabledNewsDocument = (id, status) => {
  return request({
    url: '/information/management/newsDocument/' + id + '/status/' + status,
    method: 'put',
  });
};

/**
 * 发布属性词
 */
export const addAttrWord = (data) => {
  return request({
    url: '/information/attributeWord/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取属性词page
 */
export const getAttrWordList = (data) => {
  return request({
    url: '/information/attributeWord/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 新增资讯/案例属性词关联关系
 */
export const addWordRelation = (data, url) => {
  return request({
    url: url || '/information/documentAttributeWordRelation/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询标签(分页)
 */
export const getTagsPage = (data) => {
  return request({
    url: '/information/label/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 *发布资讯-上传标签
 */
export const updateTags = (fileData, onUploadProgress) => {
  return request({
    url: '/information/label/upload',
    method: 'post',
    data: fileData,
    onUploadProgress: (event) => {
      onUploadProgress && onUploadProgress(event);
    },
  });
};

/**
 * 标签seo设置
 */
export const editTagsSeo = (data) => {
  return request({
    url: '/information/label/editSEO',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除标签
 */
export const deleteTag = (data) => {
  return request({
    url: '/information/label/del',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 编辑标签
 */
export const editTag = (data) => {
  return request({
    url: '/information/label/edit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 添加属性词
export const addAttr = (data) => {
  return request({
    url: '/information/documentAttributeWordRelation/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 覆盖属性词
export const coverAttr = (data) => {
  return request({
    url: '/information/documentAttributeWordRelation/cover',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 批量删除标签
export const batchDel = (data) => {
  return request({
    url: '/information/label/batchDel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 批量下载标签
export const batchDownloadTag = (data) => {
  return request({
    url: '/information/label/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
