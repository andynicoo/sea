import request from '@/libs/request';

/**
 * 交付时效配置列表
 */
export const durationConfigList = (data) => {
  return request({
    url: '/workorder/management/durationConfig/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 供应商时效配置首页
 */
export const durationConfigsList = (data) => {
  return request({
    url: '/workorder/management/durationConfigs/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 交付时效配置编辑
 */
export const durationModify = (data) => {
  return request({
    url: '/workorder/management/durationConfig/durationModify',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 交付时效配置新增
 */
export const durationConfigSave = (data) => {
  return request({
    url: '/workorder/management/durationConfig/save',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 供应商时效配置 新增 （新）
 */
export const durationConfigsSave = (data) => {
  return request({
    url: '/workorder/management/durationConfigs/save',
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 供应商时效配置 新增 （新）
 */
export const durationConfigsEdit = (data) => {
  return request({
    url: '/workorder/management/durationConfigs/edit?id=' + `${data.id}`,
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 开启or关闭时效配置状态
 */
export const durationConfigChange = (id) => {
  return request({
    url: '/workorder/management/durationConfig/change/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 操作记录
 */
export const logList = (params) => {
  return request({
    url: '/workorder/log/list',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 启/禁用
 */
export const openOrClose = (params) => {
  return request({
    url: '/workorder/management/durationConfigs/openOrClose',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
