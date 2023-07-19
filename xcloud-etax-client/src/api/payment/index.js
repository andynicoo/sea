import request from '@/utils/request'

/**
 * 查询支付订单
 */
 export function orderPayDetail(params) {
  return request({
    url: "/order/client/order/orderPayDetail",
    method: "post",
    params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

/**
 * 获取支付方式
 */
 export const getPayMethod = (data) => {
  data = { ...{ applyPort: 'PC', enterpriseId: 29, ...data } };
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
    url: "/order/pay/toPay",
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}