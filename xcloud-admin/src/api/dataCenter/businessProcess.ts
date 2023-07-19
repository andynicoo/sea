import axios from '@/utils/axios';

// 报表-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/data/data-work-order-time-effi/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 报表-详情
export const getDetailsInfo = (data: any) => {
  return axios({
    url: '/data/data-work-order-time-effi/detail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
