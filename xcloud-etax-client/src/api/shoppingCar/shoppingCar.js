import request from '@/utils/request';

// /**
//  * 获取国家信息列表
//  */
export const countryListApi = (params) => {
  return request({
    url: '/order/management/country/countryList',
    data: params,
    method: 'post',
  });
};

// /**
//  * 获取国家信息列表(购买服务)
//  */
export const allCountryList = (params) => {
  return request({
    url: '/order/management/country/all/list',
    data: params,
    method: 'post',
  });
};
/**
 * 获取国家信息列表
 */
export const baseInfo = (params) => {
  return request({
    url: '/order/client/country/list',
    data: { applySit: 1 },
    method: 'post',
  });
};

/**
 * 获取国家信息列表
 */
export const allCountryInfo = (params) => {
  return request({
    url: '/order/client/country/countryList',
    method: 'post',
  });
};

/**
 * 获取国家信息列表
 */
export const countryList = (params) => {
  return request({
    url: '/order/client/country/listCountry',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const productInfo = (params) => {
  return request({
    url: '/orderproduct/client/product/list',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//新获取商品列表接口
export const newProductInfo = (params) => {
  return request({
    url: '/productcenter/client/productInfo/list',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
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
    url: '/order/client/cart/delete/' + skuId,
    method: 'post',
  });
};

/**
 * 分页获取用户购物车商品列表
 */
export const getListItems = (data) => {
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
export const singleOrder = (data) => {
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
 * 购物车结算下单
 */
export const cartClearingOrder = (data) => {
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
    url: '/order/client/pay/methods',
    method: 'get',
  });
};

/**
 * 银联支付统一下单
 */
export const pay1 = (params) => {
  const data = params;
  return request({
    url: '/order/client/pay/toPay',
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
 * 获取已经完成转代理的公司列表
 */

export const getSuccessTransProxyCompanyList = (data) => {
  return request({
    url: '/etax/transformProxyWorkOrder/get/success/transproxy/companyList',
    data,
    method: 'post',
  });
};
/**
 * 是否有更多优惠券
 */

export const calculate = (data) => {
  return request({
    url: '/etax/coupon/client/orderShoppingCart/calculate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 用户是否618领取优惠券
 */
export const userCouponInfo = (data) => {
  return request({
    url: '/etax/coupon/client/userCouponInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 获取商品详情信息
 */
export const deatilInfo = (productId) => {
  return request({
    url: '/orderproduct/client/product/getProductDetail/' + productId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取活动商品详情信息
 */
export const deatilACInfo = (params) => {
  return request({
    url: `/orderproduct/client/product/activity/getProductDetail/${params.marketingActivityId}/${params.productId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取商品属性分类和属性值列表
 */
export const getcategoryAndValue = () => {
  return request({
    url: '/orderproduct/management/productAttribute/get/categoryAndValue',
    method: 'post',
  });
};
/**
 * 修改购物车数量
 */
export const updateCount = (data) => {
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
 * 获取税率
 */
export const taxRate = () => {
  return request({
    url: '/order/client/invoiceTaxRate/list',
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
