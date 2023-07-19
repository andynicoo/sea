import axios from '@/utils/axios';

// 添加规则
export const addConfigRule = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-rule/addConfigRule',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 查询历史版本
export const findHistoryList = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-rule/findHistoryList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 查询使用的规则
export const getConfigRule = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-rule/getConfigRule',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 规则选项下拉框
export const ruleFilterList = (data: any) => {
  return axios({
    url: '/custuser/data-customer-config-rule/ruleFilterList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 品牌选择下拉框
export const getBrandList = () => {
  return axios({
    url: '/custuser/data-customer-config-rule/brandList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
