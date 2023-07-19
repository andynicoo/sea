import request from '@/utils/request';

/**
 * 获取汇率
 */
export function exchangeRate(data) {
  return request({
    url: '/order/pay/exchange/rate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 查询支付订单
 */
export function orderPayDetail(params) {
  return request({
    url: '/order/client/order/orderPayDetail',
    method: 'post',
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取支付方式
 */
export const getPayMethod = (data) => {
  data = Object.assign(
    {
      applyPort: 'PC',
      enterpriseId: 29,
    },
    data
  );
  return request({
    url: '/order/pay/methods',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 去支付
 */
export function toPay(params) {
  return request({
    url: '/order/pay/toPay',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 支付回调
 */
export const payResult = (data) => {
  return request({
    url: `/order/pay/result/${data}`,
    data,
    method: 'get',
  });
};

/**
 * 支付结果
 */
export const paymentResult = (data) => {
  return request({
    url: `/order/pay/result_status/${data}`,
    data,
    method: 'get',
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
 * 国际支付上传付款凭证
 */

export const uploadCertificate = (data) => {
  return request({
    url: '/order/client/order/uploadCertificate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/* 付款链接页面提交用户反馈
 */

export const sendFeedBack = (data) => {
  return request({
    url: '/custuser/client/user/feedback',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
