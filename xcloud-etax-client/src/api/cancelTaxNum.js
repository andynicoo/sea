import request from '@/utils/request';

/**
 * 服务工单详情
 */
export function getDetail(params) {
  return request({
    url: '/workorder/client/taxCancelWorkOrder/serviceDetail',
    method: 'get',
    params,
  });
}

/**
 * 注销税号工单提交资料
 */
export function submitInfo(data) {
  return request({
    url: '/workorder/client/taxCancelWorkOrder/submitInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
