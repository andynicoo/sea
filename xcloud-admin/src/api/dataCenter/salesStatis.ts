import axios from '@/utils/axios';

// 销售统计-列表
export const salePage = (data: any) => {
  return axios({
    url: '/reportserver/saleStatistics/salePage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 销售统计-汇总
export const saleTotalStatistic = (data: any) => {
  return axios({
    url: '/reportserver/saleStatistics/saleTotalStatistic',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 销售统计-导出
export const saleExport = (data: any) => {
  return axios({
    url: '/reportserver/saleStatistics/refundDetailExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
