import axios from '@/utils/axios';

//列表查询
export const recordPageList = (data: any) => {
  return axios({
    url: '/msg/messageSenderRecord/getPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询所有流程节点列表
 */
 export const findNodes = (data:any) => {
  return axios({
    url: '/workorder/management/serviceNode/serverNodeWithFunctionCode',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const getServiceConfig = (data: any) => {
  return axios({
    url: '/msg/messageServiceRemindConfig/get',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const saveServiceConfig = (data: any) => {
  return axios({
    url: '/msg/messageServiceRemindConfig/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询操作记录
 */
 export const getRecord = (data:any) => {
  return axios({
    url: '/msg/messageConfigOperationRecord/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};




export const getRenewConfig = (data: any) => {
  return axios({
    url: '/msg/messageRenewRemindConfig/get',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const saveRenewConfig = (data: any) => {
  return axios({
    url: '/msg/messageRenewRemindConfig/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


export const getServiceStatus = (data: any) => {
  return axios({
    url: '/msg/messageServiceRemindConfig/get/config/status',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};