import request from '@/utils/request';

// pc端获取所有未上架和上架产品列表
export const getProductInfoAPI = (data) => {
  return request({
    url: '/orderproduct/client/product/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// pc端获取商品详情接口
export const getProductDetailAPI = (params) => {
  return request({
    url: '/orderproduct/client/product/getProductDetail/' + params,
    method: 'get',
  });
};

//新获取商品列表
export const newProductInfoList = (data) => {
  return request({
    url: '/productcenter/client/productInfo/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//新获取商品详情接口
export const newProductInfoDetail = (id) => {
  return request({
    url: '/productcenter/client/productInfo/product/detail?id=' + id,
    method: 'get',
  });
};

//渠道新获取商品详情接口
export const channelProductInfoDetail = (id) => {
  return request({
    url: '/productcenter/client/productInfo/channel/detail',
    data: { id },
    method: 'post',
  });
};
//新获取活动商品详情
export const marketingActivityProductDetail = (data) => {
  return request({
    url: '/marketingcenter/marketingActivity/productDetail',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//新商品根据属性查询商品规格(客户端)
export const getProductSpecsByAttribute = (data) => {
  return request({
    url: '/productcenter/client/productInfo/getProductSpecsByAttribute',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
//新商品根据属性查询商品规格(客户端)活动
export const getProductSpecsByAttributeMarketing = (data) => {
  return request({
    url: '/marketingcenter/marketingActivity/getProductSpecsByAttribute',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//新商品加入用户购物车
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

//新用户购物车商品数量

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
