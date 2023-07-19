import request from '@/utils/request';

/**
 * EPR预申报查询列表页
 */
export const getPreDeclareListAPI = (data) => {
  return request({
    url: '/workorder/client/epr/pre/declare/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR查询详情
 */
export const getPreDeclareDetailAPI = (data) => {
  return request({
    url: '/workorder/management/vat/pre/epr/detail',
    params: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
