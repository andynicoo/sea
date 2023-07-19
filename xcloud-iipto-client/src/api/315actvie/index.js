import request from '@/libs/request'
/**
 * 活动列表页接口
 */
export const getActivityList = data => {
  return request({
    url: '/order/client/activity/getActivityProductList',
    data,
    method: 'post'
  })
}

/**
 * 活动列表页接口
 */
export const getActivityProductDetail = data => {
  return request({
    url: '/order/client/activity/getActivityProductDetail',
    data,
    method: 'post'
  })
}

// /**
//  * 修改用户购物车商品数量
//  */
//  export const getActivityProductDetail = data => {
//   return request({
//     url: "/order/client/order/getActivityProductDetail",
//     data,
//     method: "post"
//   });
// };
