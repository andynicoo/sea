import axios from '@/utils/axios';

// 公司信息明细
export const getCompanyStatistics = (data: any) => {
  return axios({
    url: '/custuser/serviceCompany/statistics',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 商品收款统计
export const productPaymentAmount = (data: any) => {
  return axios({
    url: '/custuser/serviceCompany/statistics/productPaymentAmount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 公司信息明细
export const getCompanyDetail = (params: any) => {
  return axios({
    url: '/custuser/serviceCompany/detail',
    method: 'get',
    params,
  });
};

// 订单明细
export const orderDetailList = (data: any) => {
  return axios({
    url: '/custuser/serviceCompany/orderDetailList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 订单明细统计
export const orderDetailListTotal = (data: any) => {
  return axios({
    url: '/custuser/serviceCompany/orderDetailList/statistics',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 订单明细导出
export const serviceCompanyExport = (data: any) => {
  return axios({
    url: '/custuser/serviceCompany/export',
    method: 'post',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};