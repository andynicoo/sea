import axios from '@/utils/axios';

// 退款明细-列表
export const selectRefundDetailReport = (data: any) => {
  return axios({
    url: '/reportserver/refund/selectRefundDetailReport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 退款明细-统计
export const selectRefundDetailTotal = (data: any) => {
  return axios({
    url: '/reportserver/refund/selectRefundDetailTotal',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 退款明细-导出
export const refundDetailExport = (data: any) => {
  return axios({
    url: '/reportserver/refund/refundDetailExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
