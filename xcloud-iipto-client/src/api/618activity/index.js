import request from '@/libs/request';
/**
 * 活动列表页接口
 */
export const getActivityListApi = (data) => {
  return request({
    url: '/marketingcenter/marketingActivity/client/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 创建订单-pc端
 */
export const creatActivityApi = (data) => {
  return request({
    url: '/orderproduct/client/order/pc/activity/create',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 秒杀结果接口
 */
export const getActivityResultApi = (params) => {
  console.log(params);
  return request({
    url: '/order/client/order/activity/result',
    params,
    method: 'get',
  });
};

// 获取活动商品详情接口
export const getActProductDetailAPI = (params) => {
  return request({
    url: '/orderproduct/client/product/activity/getProductDetail/' + params.marketingActivityId + '/' + params.productId,
    method: 'get',
  });
};

// 获取活动参与人数
export const getActJoinNumAPI = () => {
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
