import request from '@/utils/request';

/**
 * 优惠券-列表分页(客户端)
 */
export const coupponList = (data) => {
  return request({
    url: '/marketingcenter/client/coupon/list',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取订单可选择优惠券列表
 */
export const cartCoupponList = (data) => {
  return request({
    url: '/orderproduct/client/coupon/applyList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
