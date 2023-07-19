import axios from '@/utils/axios';

//线下资料管理列表
export const getListPage = (data: any) => {
  return axios({
    url: '/xxjob/management/trademarkTransfer/pages',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//批量删除
export const batchDel = (data: any) => {
  return axios({
    url: '/xxjob/management/trademarkTransfer/batchDel',
    method: 'delete',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//编辑
export const editConfig = (data: any) => {
  return axios({
    url: '/xxjob/management/trademarkTransfer/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};