import request from '@/libs/request';

/**
 * 用户积分明细
 */
export const getUserIntegralDetails = (data) => {
  return request({
    url: "/custuser/client/user/getUserIntegralDetails",
    data,
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * 用户积分账户信息
 * @returns {*}
 */
export const getUserInegralAccount = () => {
  return request({
    url: "/custuser/client/user/getUserInegralAccount",
    method: "post"
  });
}

/**
 * 积分分类 /marketingcenter/client/integralGoodsCategory/lists
 */
 export const getIntegralGoodsCategory = () => {
  return request({
    url: "/marketingcenter/client/integralGoodsCategory/lists",
    method: "post",
    data: {
      size: 100,
      current: 1,
      status: 1
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 积分商品列表
 */
export const getIntegralGoods = (data) => {
  return request({
    url: "/marketingcenter/client/integralGoods/pageList",
    method: "post",
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 积分规则
 */
export const getIntegralConfigDetail = () => {
  return request({
    url: "/custuser/client/user/getIntegralConfigDetail",
    method: "post",
    data: {
      enterpriseCode: process.env.NODE_PLA==='wg'?49:30,
      pla:process.env.NODE_PLA
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * 用户积分账户反馈
 */
export const getUserInegralMessage = () => {
  return request({
    url: "/custuser/client/user/getUserInegralMessage",
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


















