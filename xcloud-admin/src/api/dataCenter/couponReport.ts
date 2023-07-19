import axios from '@/utils/axios';

//优惠券报表
export const getCouponAll = (data: any) => {
  return axios({
    url: '/reportserver/dataDiscountCouponReport/couponAll',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取统计
export const getCouponTotal = (data: any) => {
  return axios({
    url: '/reportserver/dataDiscountCouponReport/couponTotal',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
