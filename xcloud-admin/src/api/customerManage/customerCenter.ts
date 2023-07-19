import axios from '@/utils/axios';
import { request } from '@/utils/axios';

//客户中心列表查询
export const getCustomerCenterList = (data: any) => {
  return axios({
    url: '/custuser/data-user-customer/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//客户详情信息
export const getCustomerDetail = (data: any) => {
  return axios({
    url: '/custuser/data-user-customer/customerDetail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//客户详情订单信息
export const getOrderList = (data: any) => {
  return axios({
    url: '/order/management/order/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//线下打款账户信息
export const getUserTransferAccount = (data: any) => {
  return axios({
    url: '/custuser/management/userTransferAccount/info?userId=' + data.userId + '&enterpriseId=' + data.enterpriseId,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//线下打款账户信息-新增
export const addUserTransferAccount = (data: any) => {
  return axios({
    url: '/custuser/management/userTransferAccount/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//线下打款账户信息-修改
export const updateUserTransferAccount = (data: any) => {
  return axios({
    url: '/custuser/management/userTransferAccount/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//所属主体下拉框
export const companySubjectCodeSelect = (data: any) => {
  return axios({
    url: '/data/data-customer-config-source/companySubjectCodeList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//客户来源下拉框
export const sourceLargeSelect = (data: any) => {
  return axios({
    url: '/data/data-customer-config-source/sourceLargeList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//添加客户
export const addCustomer = (data: any) => {
  return axios({
    url: '/data/data-customer-account/addAccount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改客户
export const editCustomer = (data: any) => {
  return axios({
    url: '/data/data-customer-account/editAccount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改跟进人
export const updateFollowUserId = (data: any) => {
  return axios({
    url: '/data/data-customer-account/updateFollowUserId',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//手动推送客户线索
export const customerAccountPushXsy = (data: any) => {
  return axios({
    url: '/data/data-customer-account/customerAccountPushXsy',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//新增或修改客户成功
export const addOrEditCustomerSuccess = (data: any) => {
  return axios({
    url: '/custuser/custUserCustomerSuccess/addOrEdit',
    method: 'post',
    data,
  });
};

//查询所有ID标识
export const selectAllUnionId = () => {
  return axios({
    url: '/custuser/data-user-customer/selectAllUnionId',
    method: 'post',
  });
};

//修改客户id标识
export const manualBind = (data: any) => {
  return axios({
    url: '/custuser/data-user-customer/manualBind',
    method: 'post',
    data,
  });
};

//收款账号
export const getReceivePaymentList = (data: any) => {
  return axios({
    url: '/payment/payReceivePayment/getPage',
    method: 'post',
    data,
  });
};

// 客户信息 定点信息 统计
export const getOrderCount = (data: any) => {
  return axios({
    url: '/order/management/order/orderCount',
    method: 'post',
    data,
  });
};

// 客户信息 账号信息
export const getAccList = (params: any) => {
  return request({
    url: '/custuser/management/userTransferAccount/info/list',
    method: 'get',
    params,
  });
};
