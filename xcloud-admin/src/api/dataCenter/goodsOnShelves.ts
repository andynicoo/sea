import axios from '@/utils/axios';

//时效统计 列表
export const productAging = (data: any) => {
  return axios({
    url: '/reportserver/aging/productAging',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
