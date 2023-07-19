import axios from '@/utils/axios';

// 积分商城列表 获取
export const getIntegralGoodsList = (data: any) => {
  return axios({
    url: '/marketingcenter/management/integralGoods/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
