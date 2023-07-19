import request from '@/libs/request';

/**
 * 服务查询列表
 */
export const getServiceQueryList = (data) => {
  return request({
    url: '/workorder/management/service/new/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 导出
 */
export function exportExcel(params) {
  return request({
    url: '/workorder/management/service/export',
    method: 'post',
    responseType: 'blob',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 服务查询列表
 */
export const getQueryList = (data) => {
  return request({
    url: '/workorder/management/common/select',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 服务查询列表
 */
export const getQueryDetail = (id) => {
  return request({
    url: '/workorder/management/common/select/detail/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 服务查询列表
 */
export const getOperateList = (id) => {
  return request({
    url: '/workorder/management/simpleWorkOrder/log/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 服务查询列表
 */
export const getServiceQueryDetail = (data) => {
  return request({
    url: '/workorder/management/service/detail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
