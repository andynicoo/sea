import axios from '@/utils/axios';

// 商机报表-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/reportserver/management/dataCustomerLead/new/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 商机报表-导出
export const listExport = (data: any) => {
  return axios({
    url: '/reportserver/management/dataCustomerLead/new/report',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
