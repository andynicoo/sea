import request from '@/libs/request';
/**
 * 企业管理-企业列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return request({
    url: '/custuser/management/enterprise/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}
/**
 * 企业管理-企业新增/编辑  共用
 * @param {*} params
 * @returns
 */
export function addFirm(params) {
  return request({
    url: '/custuser/management/enterprise/addOrUpdateEnterprise',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 企业管理-企业详情
 * @param {*} params
 * @returns
 */
export function detailFirm(params) {
  return request({
    url: '/custuser/management/enterprise/info',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 企业管理-企业银行列表
 * @param {*} params
 * @returns
 */
export function detailFirmBankList() {
  const data = {
    limit: 200, //这里是后端说先传200
    page: 1,
  };
  return request({
    url: '/orderproduct/management/enterpriseBankAccount/list',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 企业管理-企业新增/编辑  品牌下拉框
 * @param {*} params
 * @returns
 */
export function getBrandList() {
  return request({
    url: '/custuser/data-customer-config-rule/brandList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
