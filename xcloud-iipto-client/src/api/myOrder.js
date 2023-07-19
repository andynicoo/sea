import request from '@/libs/request';
import qs from 'qs';

/**
 * 获取我的订单列表
 */
export const getOrderList = (data) => {
  return request({
    url: '/order/client/order/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 取消订单
 */
export const cancelOrder = (data) => {
  return request({
    url: '/order/client/order/cancel',
    data,
    method: 'post',
  });
};

/**
 * 订单详情
 */
export const orderDetailApi = (data) => {
  return request({
    url: '/order/client/order/detail',
    data,
    method: 'post',
  });
};

/**
 * 修改订单
 */
export const updateOrderApi = (data) => {
  return request({
    url: '/trademark/purchase/updateOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 修改订单付款凭证
 */
export const updatePayVoucheApi = (data) => {
  return request({
    url: '/trademark/my/order/updatePayVouche',
    data,
    method: 'post',
  });
};

/**
 * 获取发票详情
 */
export const getInvoiceDetails = (data) => {
  return request({
    url: '/order/client/order/invoice/get',
    data,
    method: 'post',
  });
};
/**
 * 申请开票
 */
export const invoice = (data) => {
  return request({
    url: '/order/client/order/invoice',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 补充开票资料
 */
export const invoiceFillMaterial = (data) => {
  return request({
    url: '/order/client/order/invoice/fillMaterial',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 申请开票
 */
export const invoiceList = (data) => {
  return request({
    url: '/order/client/order/invoice/list',
    data,
    method: 'post',
  });
};

// 头部导航
export const getNav = (data) => {
  return request({
    url: `/information/client/nav/getNav`,
    method: 'get',
  });
};

// 根据广告位获取广告
export const getAdByAdPositionKey = (data) => {
  return request({
    url: `/information/client/ad/getAdByAdPositionKey?` + qs.stringify(data),
    method: 'get',
  });
};

export const getPatentList = (data) => {
  return request({
    url: '/workorder/client/design_patent/page?' + qs.stringify(data),
    method: 'get',
  });
};

// 获取专属客户经理
export const getEmployeeCode = (data) => {
  return request({
    url: `/custuser/client/user/get/emp/qrCode`,
    method: 'get',
  });
};
