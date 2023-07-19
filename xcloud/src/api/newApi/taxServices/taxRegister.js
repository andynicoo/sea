import request from '@/libs/request';

var arr = [];
for (var i = 0; i < navigator.plugins.length; i++) {
  arr.push(navigator.plugins[i].name);
}
var navigatorPlugins = encodeURI(arr.join(','));
var screenHeight = window.screen.height;
var availheight = window.screen.availHeight;
var screenWidth = window.screen.width;
var availWidth = window.screen.availWidth;
var colorDepth = window.screen.colorDepth;

/**
 * 税号注册 列表
 * @param {*} params 参数
 */
export function getPageList(params) {
  return request({
    url: '/workorder/management/tax/reg/page',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改税号信息
 * @param {*} params 参数
 */
export function updateInputTaxInfo(params) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/update/input/taxInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 上传DE欧盟证书
 * @param {*} params 参数
 */
export function updateTaxInfoDefile(params) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/update/taxInfo/defile',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**英国 -录入邮箱 */
export function saveRegistrarEmail(data) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/saveRegistrarEmail',
    method: 'post',
    data,
  });
}
/**
 * 录入IOSS税号信息
 * @param {*} params 参数，
 *
 */
export function updateIossInfo(params) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/input/iossInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 上传西班牙海牙文件
 * @param {*} params 参数，
 *
 */
export function uploadHyFile(params) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/hy/input/info',
    method: 'post',
    data: params,
  });
}

/**
 * 根据服务ID修改或添加翻译件
 * @param {*} params servicesId  translationFile
 *
 */
export function updateTranslate(params) {
  return request({
    url: '/workorder/management/tax/reg/translation_file',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 查看翻译件
 * @param {*} params servicesId
 *
 */
export function getTranslate(workId) {
  return request({
    url: '/workorder/management/tax/reg/translation_file/' + workId,
    method: 'post',
  });
}

/**
 * 填写报税时间
 * @param {*} params
 */
export function taxReporting(params) {
  return request({
    url: '/workorder/management/declare/first',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 根据用户查询税号是否授权
 * @param {*} params
 */
export function ifAuth(params) {
  return request({
    url: '/workorder/management/bureau/auth/if',
    method: 'post',
    data: params,
  });
}

/**
 * 税局getway授权
 * @param {*} params
 */
export function mtdAuth(params) {
  return request({
    url: '/workorder/management/bureau/auth/mtd',
    method: 'post',
    data: params,
  });
}
/**
 * 税局getway授权回调
 * @param {*} params
 */
export function getwayCallback(params) {
  return request({
    url: '/workorder/management/bureau/callback',
    method: 'GET',
    params,
  });
}

/**
 * 检索增值税义务
 * @param {*} params
 */
export function vatObligations(params) {
  return request({
    url: '/workorder/management/bureau/auth/vatObligations',
    method: 'post',
    data: params,
    headers: {
      navigatorPlugins: navigatorPlugins,
      screenHeight: screenHeight,
      availheight: availheight,
      screenWidth: screenWidth,
      availWidth: availWidth,
      colorDepth: colorDepth,
    },
  });
}

/**
 *  根据国家编码获取配置信息列表
 */
export const baseInfoByCondition = (data) => {
  return request({
    url: '/workorder/client/baseinfo/list/baseInfoByCondition',
    data,
    method: 'GET',
  });
};

/**
 * 填写报税时间
 * @param {*} params
 */
export function batchModifyRtSupplier(params) {
  return request({
    url: '/workorder/management/vat/registerTaxInfo/modifyRtSupplier',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取内部转代理列表
 * @param {*} params
 */
export function getproxyWorker(params) {
  return request({
    url: '/workorder/management/vat/workorder/isProxy/page',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 删除内部转代理
 * @param {*} params
 */
export function delProxyWorker(params) {
  return request({
    url: '/workorder/management/vat/material/delete/proxy',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 税号的导出
 * @param {*} params
 */
export function exportWorkerTax(params) {
  return request({
    url: '/workorder/management/tax/reg/export/tax_invalid',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
}

/**
 * 修改税号
 * @param {*} params
 */
export function changeTaxNumber(params) {
  return request({
    url: '/workorder/management/vat/tax_quality/tax_number',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 税号查询
 * @param {integer} workOrderId 工单id
 */
export const viewTaxNumber = (workOrderId) => {
  return request({
    url: '/workorder/management/vat/tax_quality/' + workOrderId,
    method: 'get',
  });
};
