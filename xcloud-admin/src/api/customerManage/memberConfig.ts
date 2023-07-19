import axios from '@/utils/axios';

// 操作规则配置 获取
export const getMemberConfig = () => {
  return axios({
    url: '/custuser/integral-config/getByIntegralConfig',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 操作规则配置 提交
export const setMemberConfig = (data: any) => {
  return axios({
    url: '/custuser/integral-config/optIntegralConfig',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 会员积分管理 列表
export const getMemberList = (data: any) => {
  return axios({
    url: '/custuser/user-integral/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 会员等级列表
export const findVipList = (data: any) => {
  return axios({
    url: '/custuser/integral-config/findVipList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 客户管理-地址管理列表
export const findAddressList = (data: any) => {
  return axios({
    url: '/custuser/user-address/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 反馈建议-反馈列表
export const getFeedbackList = (data: any) => {
  return axios({
    url: '/custuser/managament/followrecord/feedback/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
// 反馈建议-反馈列表 标记处理
export const feedbackHandle = (data: any) => {
  return axios({
    url: '/custuser/managament/followrecord/feedback/handle',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
