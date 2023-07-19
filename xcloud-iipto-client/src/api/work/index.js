import request from '@/libs/request';
import qs from 'qs';
/**
 * 查询待办工单
 */

export const viewBacklogList = (data) => {
  return request({
    url: '/workorder/client/workBench/backlogPageList?' + qs.stringify(data),
    method: 'get',
  });
};

/**
 * 进度查询列表
 */
export const viewProgressList = (data) => {
  return request({
    url: '/workorder/client/workBench/progressList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 工作台的进度查询
 */

export const viewProgress = (data) => {
  return request({
    url: '/workorder/client/workBench/getBacklogDetail?' + qs.stringify(data),
    method: 'get',
  });
};

/**
 * 查询待办数量和商标注册工单数量
 */

export const workTodoNum = (data) => {
  return request({
    url: '/workorder/client/workBench/selectWorkBenchNumVO',
    method: 'get',
  });
};

/**
 * 查询待办工单的数量
 */

export const viewWorkNum = () => {
  return request({
    url: '/workorder/client/workBench/selectBacklogNum',
    method: 'get',
  });
};

/**
 * 查询待办工单的国家
 */


export const getCacheCountryListApi = () => {
  return request({
    url: '/workorder/client/workBench/selectCountryByUserId',
    method: 'get',
  });
};
