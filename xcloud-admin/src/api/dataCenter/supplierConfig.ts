import axios from '@/utils/axios';

// 报表-列表
export const getListPage = (data: any) => {
  return axios({
    url: '/workorder/management/durationConfigs/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 启/禁用
export const openOrClose = (params: any) => {
  return axios({
    url: '/workorder/management/durationConfigs/openOrClose',
    method: 'post',
    params,

    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 新增
export const saveConfig = (data: any) => {
  return axios({
    url: '/workorder/management/durationConfigs/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

// 编辑
export const editConfig = (params: any, data: any) => {
  return axios({
    url: '/workorder/management/durationConfigs/edit',
    method: 'post',
    params,
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
