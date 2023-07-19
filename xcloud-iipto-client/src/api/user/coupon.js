import request from '@/libs/request';

/**
 * 优惠券-列表分页(客户端)
 */
export const coupponList = (params) => {
  return request({
    url: '/orderproduct/client/coupon/list',
    method: 'get',
    params,
  });
};

/**
 * 订单可使用的优惠卷列表
 */
export const applyCoupponList = (data) => {
  return request({
    url: '/orderproduct/client/coupon/applyList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
