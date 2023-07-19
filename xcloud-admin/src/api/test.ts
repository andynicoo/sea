import axios from '@/utils/axios';

//交付时效列表
export const agingStatisticsList = (data: any) => {
  return axios({
    url: '/workorder/aging/agingStatistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getServiceQueryList = (data: any) => {
  return axios({
    url: '/workorder/management/trademark/category/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
