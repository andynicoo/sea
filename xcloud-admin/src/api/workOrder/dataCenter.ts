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
