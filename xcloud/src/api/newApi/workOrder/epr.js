import request from '@/libs/request';

/**
 * 提交epr申报
 */
export const exportDeclarationFr = (data) => {
  return request({
    url: '/workorder/management/epr/declare/detail/export/fr',
    params: data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 法国包装法epr产品系列下拉
 * @param {*} params 参数，serviceId
 */
export function declareProductCategory(params) {
  return request({
    url: '/workorder/management/epr/declare/declareProductCategoryPrice',
    method: 'post',
    params,
  });
}

/**
 * 提交epr申报
 */
export const confirmExpensesFrApi = (data) => {
  return request({
    url: '/workorder/management/epr/declare/confirmExpenses/fr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
