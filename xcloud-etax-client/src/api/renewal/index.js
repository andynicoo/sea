import request from '@/utils/request';

/**
 * 获取续费管理列表
 */
export const renewalList = (data) => {
  return request({
    url: '/workorder/client/renewal/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 获取续费管理状态开启
 */
export const renewalStatus = (data) => {
  return request({
    url: '/etax/order_services/couponActivity',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
