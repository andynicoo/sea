import axios from '@/utils/axios';

// 获取客诉列表
export const getComplaintList = (data: any) => {
  return axios({
    url: '/payment/paymentComplaint/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
