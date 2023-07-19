import request from '@/utils/request';

/**
 * 单个商品下单
 */
export const singleOrder = (data) => {
  return request({
    url: '/etax/purchase/createOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

///////////
// 315活动

//获取商品列表
export const productList = (data) => {
  return request({
    url: '/order/client/activity/getActivityProductList',
    data,
    method: 'post',
  });
};

// 获取详情
export const productDetail = (data) => {
  return request({
    url: '/order/client/activity/getActivityProductDetail',
    data,
    method: 'post',
  });
};

// 是否为第一次进入
export const fristin = (data) => {
  return request({
    url: '/orderproduct/client/activity/queryPopupRecord',
    data,
    method: 'post',
  });
};
// 获取详情
export const hasPoped = (data) => {
  return request({
    url: '/orderproduct/client/activity/savePopupRecord',
    data,
    method: 'post',
  });
};

/**
 * 获取用户零元购商品资格详情
 */
export const zeroBuyStatusAPI = () => {
  return request({
    url: '/orderproduct/client/activity/zeroBuyStatus',
    method: 'get',
  });
};

// 618
/**
 * 获取商品列表
 */
export const GoodsList618 = (data) => {
  return request({
    url: '/marketingcenter/marketingActivity/client/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 618
/**
 * 获取参与者
 */
export const acviPartner = () => {
  return request({
    url: '/orderproduct/client/activity/buyCount',
    method: 'get',
  });
};

// 抽奖活动弹窗 true:弹,false:不弹
export const needPopAPI = () => {
  return request({
    url: '/orderproduct/client/marketingActivitiesLuckDraw/needPop',
    method: 'get',
  });
};

// 获得抽奖机会 ,0:无,1:一次
export const getTimesAPI = () => {
  return request({
    url: '/orderproduct/client/marketingActivitiesLuckDraw/getTimes',
    method: 'get',
  });
};

// 刮奖接口 1代表免单，2代表茶具，3代表没中
export const getDrawResultAPI = () => {
  return request({
    url: '/orderproduct/client/marketingActivitiesLuckDraw/draw',
    method: 'get',
  });
};

// 中奖记录
export const getDrawRecordAPI = () => {
  return request({
    url: '/orderproduct/client/marketingActivitiesLuckDraw/draw/record',
    method: 'get',
  });
};

/**
 * 领券中心列表
 */
// export function selectCouponOld(data) {
//   return request({
//     url: '/orderproduct/coupon/activity/coupon/center/list',
//     method: 'post',
//     data,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }
/**
 * 新领券中心列表
 */
export function selectCoupon(data) {
  return request({
    url: '/marketingcenter/coupon/activity/coupon/center/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

//新领取优惠券
export function reactiveCoupon(data) {
  return request({
    url: '/marketingcenter/client/coupon/receive',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
