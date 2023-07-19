import axios from '@/utils/axios';

//客户线索统计
export const customerLeadAccountStatistics = () => {
  return axios({
    url: '/data/data-customer-lead/customerLeadAccountStatistics',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//客户线索列表查询
export const getSourcePageList = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//查询数据源
export const platformSelectList = () => {
  return axios({
    url: '/custuser/data-customer-config-source/platformSelectList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//添加数据源接口
export const createCustomerConfigSource = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/createCustomerConfigSource',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改数据源接口
export const updateCustomerConfigSource = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/updateCustomerConfigSource',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//刷新市场活动
export const findCampaign = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/findCampaign',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//刷新客户来源
export const getCrmSource = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-source/getCrmSource',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
