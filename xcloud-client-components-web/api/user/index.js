import request from '@/utils/request';
export const getInfo = () => {
  return request({
    url: '/custuser/client/user/info',
    method: 'post',
  });
};

//支付成功
export const payResultNew = (orderNo) => {
  return request({
    url: '/order/pay/result_new/' + orderNo,
    method: 'get',
  });
};
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

/**
 *根据id广告查询
 */
export function advertisementGetById(params) {
  return request({
    url: '/information/client/ad/getAdByAdPositionKey',
    method: 'get',
    params,
  });
}

/**
 *获取流程节点
 */
export function getServiceWorkflowListNode(flowId) {
  return request({
    url: '/workorder/management/serviceWorkflow/listNode/' + flowId,
    method: 'get',
  });
}
