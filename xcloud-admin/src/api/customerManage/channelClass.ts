import axios from '@/utils/axios';

// 列表
export const getListData = (data: any) => {
  return axios({
    url: '/system/manager/dist/findleadSourceLargeOrSmall',
    method: 'post',
    data,
  });
};

// 插入字典-批量添加-只支持一次添加一级
export const insertDictList = (data: any) => {
  return axios({
    url: '/system/manager/dist/insertDictList',
    method: 'post',
    data,
  });
};

// 重新映射大类小类的方法-关联大小类
export const updateleadSourceLargeOrSmall = (data: any) => {
  return axios({
    url: '/system/manager/dist/updateleadSourceLargeOrSmall',
    method: 'post',
    data,
  });
};

// 修改字典名称-单个修改-只支持一次修改一级
export const updateDictName = (data: any) => {
  return axios({
    url: '/system/manager/dist/updateDictName',
    method: 'post',
    data,
  });
};
