import axios from '@/utils/axios';

// VAT税号注册时效统计-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/reportserver/management/vatTaxRegister/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// VAT税号注册时效统计-汇总
export const vatTaxRegisterStatistic = (data: any) => {
  return axios({
    url: '/reportserver/management/vatTaxRegister/statistics',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// VAT税号注册时效报表-导出
export const vatTaxExport = (data: any) => {
  return axios({
    url: '/reportserver/management/vatTaxRegister/report',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 超时VAT税号注册时效统计-列表
export const overTimePage = (data: any) => {
  return axios({
    url: '/reportserver/management/vatTaxRegister/overTimePage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
