import request from '@/libs/request';

/**
 * 分页查询合规项
 */
export const searchPage = (data) => {
  return request({
    url: '/information/management/search/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 保存或者更新合规项
 */
export const searchSave = (data) => {
  return request({
    url: '/information/management/search/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 删除合规项
 */
export const searchDel = (searchNo) => {
  return request({
    url: '/information/management/search/del/' + searchNo,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询答案
 */
export const answerList = (data) => {
  return request({
    url: '/information/management/answer/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 保存或者更新答案
 */
export const answerSave = (data) => {
  return request({
    url: '/information/management/answer/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询规则
 */
export const ruleList = (params) => {
  return request({
    url: '/information/management/rule/list',
    method: 'post',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 保存或者更新规则
 */
export const ruleSave = (data) => {
  return request({
    url: '/information/management/rule/submit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 导出规则
 */
export const searchDownload = (params) => {
  return request({
    url: '/information/management/search/download',
    method: 'post',
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
