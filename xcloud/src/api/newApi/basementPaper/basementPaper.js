import request from '@/libs/request';

/**
 * 获取国家列表
 * @param countryName
 * @param limit
 * @param page
 * @param status
 */
export const getCounrtyTableData = (countryName, limit, page, status) => {
  const data = {
    countryName: countryName,
    limit: limit,
    page: page,
    status: status,
  };
  return request({
    url: 'order/management/country/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
/**
 * 国家详情
 */
export function getCountryById(params) {
  return request({
    url: '/order/management/country/getCountryById',
    method: 'get',
    params,
  });
}
/**
 * 获取申报税率列表
 */
export function getDeclareTax(params) {
  return request({
    url: '/order/management/country/getDeclareTax',
    method: 'get',
    params,
  });
}
/**
 * 新增编辑
 * @param obj
 */
export const addCountryData = (data) => {
  return request({
    url: '/order/management/country/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 禁用启用
 * @param id
 */
export const changeDisableStata = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/order/management/country/invoiceTaxRateStatus',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 获取税率列表
 * @param obj
 */
export const getTaxTableList = (obj) => {
  const data = {
    limit: obj.pageSize,
    page: obj.pageNo,
    status: obj.status,
    type: obj.type,
  };
  return request({
    url: '/order/management/invoiceTaxRate/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 禁用启用
 * @param id
 */
export const changeTaxState = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/order/management/invoiceTaxRate/invoiceTaxRateStatus',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 添加编辑
 * @param obj
 */
export const addOrUpdateTax = (obj) => {
  const data = {
    id: obj.id,
    enterpriseId: obj.enterpriseId,
    status: obj.status,
    taxRate: obj.taxRate,
    type: obj.type,
  };
  return request({
    url: '/order/management/invoiceTaxRate/addOrUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取银行列表
 * @param obj
 */
export const getBankTableList = (obj) => {
  const data = {
    limit: obj.pageSize,
    page: obj.pageNo,
    status: obj.status,
    bankAccount: obj.bankAccount,
    enterpriseIdList: obj.enterpriseIdList
  };
  return request({
    url: '/order/management/enterpriseBankAccount/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 禁用启用
 * @param id
 */
export const changeBankState = (id) => {
  const params = {
    id: id,
  };
  return request({
    url: '/order/management/enterpriseBankAccount/updateStatus',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 新增
 * @param obj
 */
export const addBank = (obj) => {
  const data = obj;
  return request({
    url: '/order/management/enterpriseBankAccount/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改
 * @param obj
 */
export const updateBank = (obj) => {
  const data = obj;
  return request({
    url: '/order/management/enterpriseBankAccount/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取国家编码
 */
export const getCountryCode = () => {
  return request({
    url: '/order/management/country/getCountryCode',
    method: 'post',
  });
};
