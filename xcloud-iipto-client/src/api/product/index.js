import request from '@/libs/request';

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
