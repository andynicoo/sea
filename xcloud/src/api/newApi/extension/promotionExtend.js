import request from '@/libs/request';

/** 营销管理-员工列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return request({
    url: '/custuser/management/invatechannel/list/personage',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}
/** 营销管理-删除 暂无
 * @param {*} params
 * @returns
 */
export function deleteList(params) {
  return request({
    url: '/custuser/management/invatechannel/list',
    method: 'post',
    data: params,
  });
}

/** 营销管理-详情
 * @param {*} params
 * @returns
 */
export function getDeatil(params) {
  return request({
    url: '/custuser/management/invatechannel/get/getUserChannelInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}
/** 营销管理-编辑/新增
 * @param {*} params
 * @returns
 */
export function addStaff(params) {
  return request({
    url: '/custuser/management/invatechannel/addOrUpdate/personage/channel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/** 营销管理-编辑回显
 * @param {*} params
 * @returns
 */
export function getUserChannel(params) {
  return request({
    url: '/custuser/management/invatechannel/get/getUserChannel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/** 禁用/启用 */
export function getUpdateChannelStatus(params) {
  return request({
    url: '/custuser/management/invatechannel/updateChannelStatus',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}
/** 编辑时删除新增链接 */
export function deleteChannelPage(params) {
  return request({
    url: '/custuser/management/invatechannel/deleteChannelPage',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/** 分页获取员工推广注册用户数 */
export function getUserChannelRegisterInfo(params) {
  return request({
    url: '/custuser/management/invatechannel/get/getUserChannelRegisterInfo',
    method: 'post',
    data: params,
  });
}

/** 分页获取渠道付费用户列表 */
export function getOrderChannelInfo(params) {
  return request({
    url: '/custuser/management/invatechannel/get/getOrderChannelInfo',
    method: 'post',
    data: params,
  });
}

/**
 * 预警工单导出
 */
export const excelList = (data) => {
  return request({
    url: '/custuser/management/invatechannel/list/excelList',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/** --------------------------- 链接地址 ----------------------------**/
/**
 * 添加地址
 * @param {*} data
 * @returns
 */
export const saveLinkAddress = (data) => {
  return request({
    url: '/custuser/management/linkAddress/saveLink',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 链接管理列表
 * @param {*} data
 * @returns
 */
export const linkAddressPageList = (data) => {
  return request({
    url: '/custuser/management/linkAddress/pageListLink',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *链接管理详情列表
 * @param {*} data
 * @returns
 */
export const linkAddressDetailPageList = (data) => {
  return request({
    url: '/custuser/management/linkAddress/pageDetailList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *修改地址
 * @param {*} data
 * @returns
 */
export const linkAddressUpdateLinkAddress = (data) => {
  return request({
    url: '/custuser/management/linkAddress/updateLink',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** 获取二维码
 * @param {*} params
 * @returns
 */
export function getShareCode(params,data) {
  return request({
    url: '/custuser/client/login/getUnlimitedQRCode',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'enterpriseCode': data.code,
      'enterpriseId' : data.id
    },
  });
}

/** 获取链接
 * @param {*} params
 * @returns
 */
export function getLink(params) {
  return request({
    url: '/custuser/client/link/createChannelUrl',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 订单明细列表
 * @param {*} params
 * @returns
 */


export function orderDetails(params) {
  return request({
    url: '/custuser/management/linkAddress/orderDetailList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 注册明细列表
 * @param {*} params
 * @returns
 */


export function registerDetails(params) {
  return request({
    url: '/custuser/management/linkAddress/registerDetailList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}