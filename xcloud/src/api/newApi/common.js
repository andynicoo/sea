import request from '@/libs/request';
import qs from 'qs';

/**
 * 系统公用的api接口
 */

/**
 * 上传文件-阿里云OSS服务接口
 * @param {FormData} fileData 文件上传数据formData
 * @param {Function} callback 上传进度的回调函数
 */
export function uploadFile(fileData, onUploadProgress) {
  return request({
    // url: "https://pre-api.itaxs.com/file/oss/upload",
    method: 'post',
    data: fileData,
    onUploadProgress: (event) => {
      onUploadProgress && onUploadProgress(event);
    },
  });
}

/**
 * 删除文件-阿里云OSS服务接口
 * @param {*} params 参数，主要传name字段
 */
export function deleteFile(params) {
  return request({
    url: '/file/oss/delete',
    method: 'post',
    data: qs.stringify(params),
  });
}
/**
 * 获取企业选项
 *  @param {*} params 参数，
 */
export function getFirm(params) {
  return request({
    url: '/custuser/management/enterprise/getSelect',
    method: 'post',
    data: params,
  });
}

/**
 * 获取国家下拉框数据
 */
export function getCountrySelectList(params) {
  return request({
    url: '/order/management/country/countryList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 获取所有国家名称
 */
export function getCountriesName(params) {
  return request({
    url: '/order/management/country/getCountriesName',
    method: 'get',
    params,
  });
}
/**
 * 获取收款账户数据
 */
export function getBankAccountList(params) {
  return request({
    url: '/order/management/enterpriseBankAccount/listEnterpriseBankAccount',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 客户管理-跟进人/邀请人下拉列表
 * @param {*} params
 * @returns
 */
export function userList(params) {
  return request({
    url: '/base/user/all',
    method: 'GET',
    data: params,
  });
}

/**
 * 获取服务类型
 */
export const getFunctionCode = (data) => {
  return request({
    url: '/orderproduct/management/category/subCategory',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 获取服务类型
 */
export const getUserListByRole = (params) => {
  return request({
    url: '/base/role/users/info',
    params,
    method: 'get',
  });
};

/**
 * 获取驳回节点(驳回节点可能为空)
 */
export const getRejectCode = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/getRejectCode',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 工单税务经理列表
 */
export const getDisposelist = (params) => {
  return request({
    url: '/workorder/management/taxDisposeManager/listDispose',
    params,
    method: 'get',
  });
};

/**
 * 税务经理批量更改
 */
export const disposeModifyBatch = (data) => {
  return request({
    url: '/workorder/management/vat/dispose/disposeModifyBatch',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取公司和客户vat税号
 */
export const taxCustUserVatNumber = (params) => {
  return request({
    url: '/workorder/management/taxCustUserVatNumber/list',
    params,
    method: 'get',
  });
};

/**
 * 节点和服务进度查询
 */
export const serverNodeWithProgressBar = (params) => {
  return request({
    url: '/workorder/management/serviceNode/serverNodeWithProgressBar',
    params,
    method: 'post',
  });
};

/**
 * 物流商信息
 */
export const getLogistics = (data) => {
  return request({
    url: '/workorder/serviceConst/list/getLogistics',
    data,
    method: 'post',
  });
};
/**
 * 服务状态列表
 */
export const serviceStatus = (params) => {
  return request({
    url: '/workorder/serviceStatus',
    params,
    method: 'GET',
  });
};
export const serviceProgress = (params) => {
  return request({
    url: '/workorder/management/vat/workorder/nodes',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//获取操作记录
export const getBusinessLogListByNo = (data) => {
  return request({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//获取操作记录
export const getBusinessLogListByWorkNo = (data) => {
  return request({
    url: '/other/management/businessLog/listByWorkNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 客服批量更改
 */
export const disposeCustomerBatch = (data) => {
  return request({
    url: '/workorder/management/vat/dispose/customer/handler',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 客服批量更改
 */
export const changeCustomerBatch = (data) => {
  return request({
    url: '/workorder/management/filing/customer/handler',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据dataType获取基础数据
 */
export const getBaseDataByDataType = (params) => {
  return request({
    url: '/base/baseData/list',
    params,
    method: 'get',
  });
};

/**
 * 批量下载
 */
export const batchDownloadVat = (data) => {
  return request({
    url: '/workorder/management/vat/download/new',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 批量下载
 */
export const batchDownloadEprReg = (data) => {
  return request({
    url: '/workorder/management/vat/download',
    params: data,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 批量提交服务商
 */
export const batchSubmitSupplier = (data) => {
  return request({
    url: '/workorder/management/vat/epr/supplier/batch',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询所有工单类型
 */
export const workFunction = (params) => {
  return request({
    url: '/workorder/management/workFunction',
    params,
    method: 'get',
  });
};

export const listEnableAll = () => {
  return request({
    url: '/custuser/management/enterprise/listEnableAll',
    method: 'post',
  });
};

/**
 * 供应商列表查询
 */
export const getSupplierList = (data) => {
  return request({
    url: '/settlementcenter/management/base/supplier/supplierFunctionCode/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//获取数据源数据
export const getSourceList = () => {
  return request({
    url: '/data/data-customer-config-source/sourceList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const saveNavLately = (data) => {
  return request({
    url: '/workorder/workPendingItem/save/nav/lately',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
