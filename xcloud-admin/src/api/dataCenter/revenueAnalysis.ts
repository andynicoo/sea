import axios from '@/utils/axios';

//订单销售数据统计
export const getOrderSalesStatistics = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/statistics',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//商品营收趋势(所有的)
export const getOrderSalesAllTrend = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/allTrend',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//商品营收趋势
export const getOrderSalesTrend = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/trend',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//部门销售排行
export const getOrderDepartmentRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/department/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//类目销售排行
export const getProductCategoryRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/productCategory/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//国家销售排行
export const getCountryRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/country/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//服务商销售排行
export const getSupplierRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/supplier/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//商品销售排行
export const getProductRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/product/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//人员销售排行
export const getAttributionRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/attribution/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//退款原因分析排行
export const getRefundReasonRank = (data: any) => {
  return axios({
    url: '/reportserver/management/orderSales/refundReason/rank',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
