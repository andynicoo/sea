import axios from '@/utils/axios';

// 获取产品列表
export const getProductList = (data: any) => {
  return axios({
    url: '/information/productInfo/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 根据id查询产品详情
export const getProductById = (params: any) => {
  return axios({
    url: '/information/productInfo/detail',
    method: 'get',
    params,
  });
};

// 更新产品状态
export const updateStatus = (data: any) => {
  return axios({
    url: '/information/productInfo/updateStatus',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取关联产品大类
export const getProductBigList = (params: any) => {
  return axios({
    url: '/information/productCategory/getList',
    method: 'get',
    params,
  });
};

// 刷新，获取最新商品
export const rfreshList = (params: any) => {
  return axios({
    url: '/information/productInfo/refresh',
    method: 'get',
    params,
  });
};

// 编辑产品
export const editProduct = (data: any) => {
  return axios({
    url: '/information/productInfo/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
