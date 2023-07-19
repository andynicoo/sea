import request from '@/libs/request';
/**
 * 分页获取处理人分配规则列表
 * @param {*} params
 * @returns
 */
export function pageList(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/pageList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
//获取商品类型
export const goodsCategory = (params) => {
  return request({
    url: `/workorder/management/xcloudHandlerAllot/category/${params.type}`,
    method: 'get',
  });
};

/**
 * 获取工单流程编码
 */
export function getFunctionCode(params) {
  return request({
    url: '/orderproduct/management/category/get/functionCode',
    method: 'post',
    params,
  });
}

/**
 * 删除处理人分配规则
 */
export function deleteHandler(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/delete',
    method: 'post',
    data: params,
  });
}

/**
 * 获取所有处理人类型
 */
export function getHandlerUserType(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/handlerUserType',
    method: 'post',
    data: params,
  });
}

/**
 * 处理人分配规则-根据ID查询详情
 * @param {*} params xcloudHaxndlerAllotId
 */
export function getInfo(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/info',
    method: 'post',
    data: params,
  });
}

/**
 * 添加处理人分配规则
 */
export function addHandler(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/insert',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 处理人分配规则-启用禁用
 * xcloudHaxndlerAllotId
 */
export function handlerStatus(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/status',
    method: 'post',
    data: params,
  });
}
/**
 * 修改处理人分配规则
 */
export function updateHandlerAllot(params) {
  return request({
    url: '/workorder/management/xcloudHandlerAllot/update',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
