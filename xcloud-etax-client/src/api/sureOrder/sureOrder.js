import request from '@/utils/request';

/**
 * 获取商户id
 */
export const getChannelId = () => {
  return request({
    url: '/pay/channel/list',
    method: 'get',
  });
};

/**
 * 统一下单
 */
export const pay = (params) => {
  const data = params;
  return request({
    url: '/pay/order/pay',
    data,
    method: 'post',
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
    // url: '/etax/order/client/uploadPaymentFile',
    url: '/order/client/order/paymentfile/upload',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 上传付款凭证-批量
 */

export const uploadPaymentFileMore = (data) => {
  return request({
    url: '/etax/order/client/batchUploadPaymentFile',
    data,
    method: 'post',
  });
};

/**
 * 服务续费
 */
export const createRenewOrder = (params) => {
  const data = params;
  return request({
    url: '/etax/purchase/createRenewOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 秒杀创建订单
 */
export const activityOrder = (data) => {
  return request({
    url: '/order/client/order/pc/activity/create',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 秒杀订单信息
 */
export const getOrderStatus = (params) => {
  return request({
    url: '/order/client/order/activity/result',
    params,
    method: 'get',
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
 *  订单状态
 */
export const getPayresultStatus = (orderNo) => {
  return request({
    url: `/order/pay/result_status/${orderNo}`,
    method: 'get',
  });
};
