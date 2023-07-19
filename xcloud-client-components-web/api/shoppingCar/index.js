import request from '@/utils/request';

/**
 * 订单详情
 */
export const orderDetailApi = (data) => {
  return request({
    url: '/order/client/order/detail',
    data,
    method: 'post',
  });
};

/**
 * 秒杀结果接口
 */
export const getActivityResultApi = (params) => {
  console.log(params);
  return request({
    url: '/order/client/order/activity/result',
    params,
    method: 'get',
  });
};

/**
 * 获取支付方式
 */
export const getPayMode = (data) => {
  data = Object.assign(
    { applyPort: 'PC', enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId },
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
 * 获取税率接口
 */
export const invoiceTaxRateApi = (data) => {
  return request({
    url: '/order/client/invoiceTaxRate/list',
    data,
    method: 'post',
  });
};

/**
 * 优惠券计算金额
 */
export const getDiscountAmount = (data) => {
  return request({
    url: '/marketingcenter/management/coupon/discountAmount/calc',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 单个商品下单
 */
export const createOrderApi = (data) => {
  return request({
    url: '/order/client/order/create',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 活动商品下单
 */
export const activityCreateApi = (data) => {
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
 * 订单可使用的优惠卷列表
 */
export const applyCoupponList = (data) => {
  return request({
    url: '/marketingcenter/client/coupon/applyList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 支付
 */
export const toPay = (data) => {
  return request({
    url: '/order/pay/toPay',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 缓存中获取国家数据
 */
export const getCacheCountryListApi = () => {
  return request({
    url: '/order/management/country/countryList',
    method: 'post',
  });
};

/**
 * 修改用户购物车商品数量
 */
export const modifyShoppingCartNumber = (data) => {
  return request({
    url: '/order/client/cart/updateCount',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 用户购物车商品数量
 */

export const totalShoppingCart = (data) => {
  return request({
    url: '/order/client/cart/count',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 删除用户购物车商品
 */
export const deleteCartItems = (data) => {
  return request({
    url: '/order/client/cart/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 分页获取用户购物车商品列表
 */
export const getListItems = () => {
  return request({
    url: '/order/client/cart/list',
    method: 'get',
  });
};

/**
 * 续费管理的支付下单
 */
export const renewalPay = (data) => {
  return request({
    url: '/order/client/order/renewal',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

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
 *  订单收银台详情
 */
export const queryUserTransferAccountInfo = (params) => {
  return request({
    url: '/order/pay/queryUserTransferAccountInfo?userId=' + `${params}&enterpriseId=42`,
    method: 'get',
  });
};

/**渠道购物车接口 */
export const getChannelListItems = () => {
  return request({
    url: '/order/client/cart/channel/list',
    method: 'get',
  });
};

/**
 *  周期结算 支付
 */
export const cycleToPay = (data) => {
  return request({
    url: '/order/client/pay/channel/toPay',
    data,
    method: 'post',
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
