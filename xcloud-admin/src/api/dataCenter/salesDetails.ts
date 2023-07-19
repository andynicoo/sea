import axios from '@/utils/axios';

// 销售明细列表-列表
export const selectRenewalMessageRead = (data: any) => {
  return axios({
    url: '/reportserver/saleDetail/selectRenewalMessageRead',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 销售明细金额总计
export const selectSalesAmount = (data: any) => {
  return axios({
    url: '/reportserver/saleDetail/selectSalesAmount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 销售明细导出
export const salesDetailExport = (data: any) => {
  return axios({
    url: '/reportserver/saleDetail/salesDetailExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 财务销售导出
export const financialSalesExport = (data: any) => {
  return axios({
    url: '/reportserver/saleDetail/financialSalesExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

// 业务导出
export const financialBusinessExport = (data: any) => {
  return axios({
    url: '/reportserver/saleDetail/costBusinessExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
