import axios from '@/utils/axios';

//单个核名列表
export const getUseLabel = (data = {}) => {
  return axios({
    url: '/workorder/workOrderLabel/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getListByWork = () => {
  return axios({
    url: '/workorder/management/workFunction/listByWork',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const getWorkCategory = () => {
  return axios({
    url: '/workorder/management/workCategory',
    method: 'get',
  });
};

export const getListByCategory = (data = {}) => {
  return axios({
    url: '/workorder/management/workFunction/listByCategory',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const saveOrUpdate = (data = {}) => {
  return axios({
    url: '/workorder/workOrderLabel/saveOrUpdate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const deleatLabel = (data = {}) => {
  return axios({
    url: '/workorder/workOrderLabel/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
