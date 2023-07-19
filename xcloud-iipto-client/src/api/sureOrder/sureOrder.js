import request from '@/libs/request';

/**
 * 获取商户id
 */
export const getChannelId = (params) => {
  return request({
    url: '/pay/channel/list',
    params,
    method: 'get',
  });
};

/**
 * 银联支付统一下单
 */
export const pay1 = (params) => {
  const data = params;
  return request({
    url: '/pay/order/yopPay',
    data,
    method: 'post',
  });
};

/**
 * 返回订单信息
 */
export const payOrderReturn = (params) => {
  return request({
    url: '/pay/order/query',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 上传付款凭证
 */

export const uploadPaymentFile = (data) => {
  return request({
    url: '/order/client/order/paymentfile/upload',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 优惠券计算金额
 */
export const getDiscountAmount = (data) => {
  return request({
    url: '/orderproduct/client/order/discountAmount/calc',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *  根据币种汇率计算金额
 */
export const rateCalculateAmount = (data) => {
  return request({
    url: '/order/pay/exchange/rate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *  根据币种汇率计算金额
 */
export const getPayresultStatus = (orderNo) => {
  return request({
    url: `/order/pay/result_status/${orderNo}`,
    method: 'get',
  });
};