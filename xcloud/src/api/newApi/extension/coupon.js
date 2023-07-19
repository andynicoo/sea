import request from '@/libs/request';

/**营销管理-优惠券列表
 * @param {*} params
 * @returns
 */
export function getList(data) {
  return request({
    url: '/marketingcenter/management/coupon/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠券领取记录列表
 * @param {*} params
 * @returns
 */
export function getReceivedList(data) {
  return request({
    url: '/marketingcenter/management/coupon/received/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠券编辑
 * @param {*} params
 * @returns
 */
export function editCoupon(data) {
  return request({
    url: '/marketingcenter/management/coupon/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠券发放
 * @param {*} params
 * @returns
 */
export function sendCoupon(data) {
  return request({
    url: '/marketingcenter/management/coupon/send',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠券发放
 * @param {*} params
 * @returns
 */
export function createCoupon(data) {
  return request({
    url: '/marketingcenter/management/coupon/create',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**营销管理-优惠券作废
 * @param {*} params
 * @returns
 */
export function invalid(params) {
  return request({
    url: '/marketingcenter/management/coupon/nullify',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**营销管理-获取国家列表
 * @param {*} params
 * @returns
 */
export function countryList(params) {
  return request({
    url: '/order/management/country/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function getInfoByMobile(data) {
  return request({
    url: '/custuser/management/user/getInfoByMobile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠券删除
 * @param {*} params
 * @returns
 */
export function deleteCoupon(data) {
  return request({
    url: '/marketingcenter/management/coupon/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠劵开始/结束领取
 * @param {*} params
 * @returns
 */
export function startOrFinish(data) {
  return request({
    url: '/marketingcenter/management/coupon/startOrFinish',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-优惠劵详情
 * @param {*} params
 * @returns
 */
export function couponInfo(data) {
  return request({
    url: '/marketingcenter/management/coupon/info',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-积分商城列表
 * @param {*} params
 * @returns
 */
export function getIntegralList(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-编辑商品
 * @param {*} params
 * @returns
 */
export function updateIntegralProduct(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/updateIntegralGoods',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-新增商品
 * @param {*} params
 * @returns
 */
export function addIntegralProduct(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/addIntegralGoods',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-商品列表 根据id查询产品
 * @param {*} params
 * @returns
 */
export function getIntegralGoodsDetail(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/getIntegralGoodsDetail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-商品列表 根据id编辑产品
 * @param {*} params
 * @returns
 */
export function updateIntegralGoods(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/updateIntegralGoods',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-商品列表 根据id删除产品
 * @param {*} params
 * @returns
 */
export function deleteGoods(data) {
  return request({
    url: '/marketingcenter/management/integralGoods/deleteGoods',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-兑换订单-列表
 * @param {*} params
 * @returns
 */
export function getIntegralOrder(data) {
  return request({
    url: '/marketingcenter/management/integralOrder/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**批量修改积分状态
 * @param {*} params
 * @returns
 */
export function batchExchangeIntegral(data) {
  return request({
    url: '/marketingcenter/management/integralOrder/batchExchange',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**营销管理-活动挂你-兑换记录列表-编辑
 * @param {*} params
 * @returns
 */
export function updateIntegralGoodsOrde(data) {
  return request({
    url: '/marketingcenter/management/integralOrder/updateIntegralGoodsOrder',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**积分商品分类列表分页
 * @param {*} params
 * @returns
 */
export function integralClassify(data) {
  return request({
    url: '/marketingcenter/management/integralGoodsCategory/pages',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**积分商品分类列表
 * @param {*} params
 * @returns
 */
export function integralClassifyList(data) {
  return request({
    url: '/marketingcenter/management/integralGoodsCategory/lists',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**删除积分商品分类
 * @param {*} params
 * @returns
 */
export function integralClassifyDel(params) {
  return request({
    url: '/marketingcenter/management/integralGoodsCategory/del',
    method: 'delete',
    params,
  });
}

/**新增积分商品分类
 * @param {*} params
 * @returns
 */
export function addIntegralClassify(data) {
  return request({
    url: '/marketingcenter/management/integralGoodsCategory/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑积分商品分类
 * @param {*} params
 * @returns
 */
export function editIntegralClassify(data) {
  return request({
    url: '/marketingcenter/management/integralGoodsCategory/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**增加库存
 * @param {*} params
 * @returns
 */
export const addStock = (params) => {
  return request({
    url: '/marketingcenter/management/integralGoods/addStock',
    method: 'get',
    params,
  });
};
