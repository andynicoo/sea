import axios from '@/utils/axios';

// 供应商质量-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/reportserver/management/salesDeliveryDetails/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const listExport = (data: any) => {
  return axios({
    url: '/reportserver/management/salesDeliveryDetails/report',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
