import request from '@/libs/request';

/**
 * 商品服务名称
 */
export function listByCountryCode(params) {
  return request({
    url: '/orderproduct/management/productInfo/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
//新获取商品列表接口
export function productInfoList(params) {
  return request({
    url: '/productcenter/client/productInfo/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 订单录入
 */
export function addOrder(params) {
  return request({
    url: '/order/management/order/create',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 税点
 */
export function taxRate(params) {
  return request({
    url: '/order/management/invoiceTaxRate/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改订单 数据回显
 * id
 */
export function orderDeatil(id) {
  return request({
    url: '/order/management/order/editResult/' + id,
    method: 'GET',
  });
}

/**
 * 修改订单 订单提交
 * id
 */
export function updataOrder(params) {
  return request({
    url: '/order/management/order/update',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 订单录入-退换货
 */
export function createExchange(params) {
  return request({
    url: '/order/management/order/create/exchange',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 计算退换货金额
 */
export function calcRefund(params) {
  return request({
    url: '/order/management/order/exchange/calcRefund',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 新增客户---弃用
 */
export function addAccount(params) {
  return request({
    url: '/data/data-customer-account/addAccount',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 新增客户
 */
export function addAccountNew(params) {
  return request({
    url: '/custuser/management/user/order/addXcloudUserLead',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 手工录单-校验是否存在暂存
 */
export function checkTemporary() {
  return request({
    url: '/order/management/order/checkTemporary',
    method: 'get',
  });
}

/**
 * 手工录单-暂存
 */
export function addTemporary(params) {
  return request({
    url: '/order/management/order/temporary',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 手工录单-获取暂存
 */
export function getTemporary() {
  return request({
    url: '/order/management/order/getTemporary',
    method: 'get',
  });
}

/**
 * 商品详情
 */
export function getProductDetail(params) {
  return request({
    url: '/productcenter/productInfo/detail',
    method: 'get',
    params,
  });
}
