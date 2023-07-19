import request from '@/libs/request';

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
 * 商品加入用户购物车
 */
export const addToCart = (data) => {
  return request({
    url: '/order/client/cart/add',
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
export const deleteCartItems = (skuId) => {
  return request({
    url: '/order/client/cart/delete/' + `${skuId}`,
    method: 'post',
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
 * 获取支付方式
 */
 let plaConfig={
  kby: '30',
  wg: '49'
}
export const getPayMode = (data) => {
  data = { ...data, ...{ applyPort: 'PC', enterpriseId: plaConfig[process.env.NODE_PLA] } };
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
 * 单个商品下单
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
 * 支付回调
 */
export const payResult = (data) => {
  return request({
    url: `/order/pay/result/${data}`,
    data,
    method: 'get',
  });
};
