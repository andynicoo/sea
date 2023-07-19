import axios from '@/utils/axios';

//续费看板数据统计
export const getRenewalStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/amount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//续费看板数据明细统计
export const getRenewalDetailStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/workOrders',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//部门统计
export const getDepartmentStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/department',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//商品分类统计
export const getProductCategoryStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/productCategory',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//国家销售排行
export const getCountryStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/country',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//销售人员统计
export const getSalesPersonnelStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/user',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//不续费原因统计
export const getReasonStatistics = (data: any) => {
  return axios({
    url: '/reportserver/renewal/statistics/reason',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
