import axios from '@/utils/axios';

// 商机报表-配置部门
export const departmentList = (data: any) => {
  return axios({
    url: '/reportserver/management/opportunity/departmentList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 商机报表-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/reportserver/management/opportunity/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 商机报表-汇总
export const totalStatistic = (data: any) => {
  return axios({
    url: '/reportserver/management/opportunity/statistics',
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
    url: '/reportserver/management/opportunity/report',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
