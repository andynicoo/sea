import request from '@/utils/request';

/**
 * 法国包装法epr产品系列下拉
 * @param {*} params 参数，serviceId
 */
export function declareProductCategory(params) {
  return request({
    url: '/workorder/client/epr/declare/declareProductCategoryPrice',
    method: 'post',
    params,
  });
}
/**
 * 计算费用
 */
export const calcuFrDeclare = (params) => {
  return request({
    url: '/workorder/client/epr/declare/calculatingExpenses/fr',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 法国包装法提交申报
 */
export const frDeclareSubmit = (params) => {
  return request({
    url: '/workorder/client/epr/declare/submit/fr',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 法国包装法获取申报产品税额配置表
 * @param {*} params supplierCode
 */
export function eprDeclareFrConfig(params) {
  return request({
    url: '/workorder/client/epr/declare/eprDeclareFrConfig',
    method: 'post',
    params,
  });
}

/**
 * 法国包装法获取本土公司
 * @param {*} params supplierCode
 */
export function isLocalConpany(params) {
  return request({
    url: '/workorder/management/epr/declare/isLocalConpany',
    method: 'post',
    params,
  });
}

/**
 * 法国电池法epr产品系列下拉
 * @param {*} params 参数，serviceId
 */
export function declareFrBattCategory(params) {
  return request({
    url: '/workorder/client/epr/declare/battery/frCate/treeBySupplierId',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
