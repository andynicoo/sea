import axios, { request } from '@/utils/axios';

//获取登录用户企业选项
export const getEnterpriseSelect = () => {
  return axios({
    url: '/custuser/management/enterprise/getSelect',
    method: 'post',
  });
};

//获取国家下拉框数据
export const getCountrySelectList = () => {
  return axios({
    url: '/order/management/country/countryList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取公司所在地区列表
export const getRegionList = () => {
  return request({
    url: '/workorder/vat/deRegion',
    method: 'get',
  });
};

//获取服务商/供应商下拉数据 (启用)
export const getSupplierList = () => {
  return axios({
    url: '/settlementcenter/management/base/supplier/list',
    method: 'post',
    data: {
      status: 1,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取部门树级列表
export const getDepartmentTree = () => {
  return axios({
    url: '/base/xcloudOrgDepartment/all/tree',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//获取所有用户列表
export const getAllUsers = () => {
  return axios({
    url: '/base/user/all',
    method: 'get',
  });
};

//获取所有用户列表(在职)
export const getValidUsers = () => {
  return axios({
    url: '/custuser/data-customer-config-source/getXcloudUserJobList',
    method: 'post',
  });
};

//获取服务商品列表 二级下拉
export function getproductInfoList(data: any) {
  return axios({
    url: '/productcenter/client/productInfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

//获取数据源数据
export const getSourceList = () => {
  return axios({
    url: '/custuser/data-customer-config-source/sourceList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取大类小类的二级联动
export const findDictByCodeList = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/findDictByCodeList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取商品分类 二级联动
export const getAllCategory = (data: any) => {
  return axios({
    url: '/productcenter/productCategory/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取用户手机信息
export const getInfoByMobile = (data: any) => {
  return axios({
    url: '/custuser/management/user/getInfoByMobile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//工单类型 二级联动
export const listByCategory = () => {
  return axios({
    url: '/workorder/management/workCategory/list',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 基础数据
export const baseDataType = (params: any) => {
  return axios({
    url: '/base/baseData/list',
    method: 'get',
    params,
  });
};

//线索的跟进状态下拉框
export const leadFollowStatusList = () => {
  return axios({
    url: '/custuser/data-customer-config-source/leadFollowStatusList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 部门选择下拉框
export const getDepartmentSelect = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-rule/findBaseUserMapKeydepartment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 品牌下拉框
export const getBrandList = () => {
  return axios({
    url: '/custuser/data-customer-config-rule/brandList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 推送状态下拉框
export const getCustomerLeadStatusList = () => {
  return axios({
    url: '/custuser/data-customer-config-source/customerLeadStatusList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//获取市场活动下拉数据
export const pageListLink = (data: any) => {
  return axios({
    url: '/custuser/management/linkAddress/pageListLink',
    method: 'post',
    data,
  });
};

export const getCities = () => {
  return axios({
    url: '/custuser/data-user-customer/attribution',
    method: 'post',
  });
};

//获取工单操作记录列表
export const getBusinessLogListByNo = (data: any) => {
  return axios({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
  });
};

// 上传文件
export const importFileApi = (data: any) => {
  return request({
    url: '/file/oss/upload2',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
